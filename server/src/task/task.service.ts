import {
  BadRequestException,
  // forwardRef,
  // HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

//models + inputs + dtos
import { CreateTaskInput, UpdateTaskInput } from './task.inputs';
import { BaseTaskMongo, Task, TaskDocument } from './task.model';
import { BaseUserMongo } from 'src/user/user.model';
import { BaseBookMongo, Book } from 'src/book/book.model';
import { TaskStatus } from './task-status.enum';
import { TaskPriority } from './task-priority.enum';
import { TaskHistory } from './task-history.model';
import {
  UpdateTaskHistoryInput,
  CreateTaskHistoryInput,
} from './task-history.inputs';
import {
  MAX_TASK_HISTORY_PER_REQUEST,
} from 'src/consts/defaults';
import { PageDataConfig } from 'src/graphql/relay/page-data';

//services
import { BookService } from 'src/book/book.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly _taskModel: Model<TaskDocument>,
    private readonly _bookService: BookService,
  ) {}

  //TASKS
  async createTask(
    currentUser: BaseUserMongo,
    input: CreateTaskInput,
  ): Promise<Task> {
    try {
      const bookId = input.bookId ? input.bookId : '';
      const openLibraryBookId = input.openLibraryBookId
        ? input.openLibraryBookId.trim()
        : '';

      if (!bookId && !openLibraryBookId) {
        throw new BadRequestException(
          `Either field 'bookId' or 'openLibraryBookId' must be provided!`,
        );
      }

      let book: Book;
      if (bookId && openLibraryBookId) {
        book = await this._bookService.addExistingBook(currentUser, bookId);
      } else {
        if (bookId) {
          book = await this._bookService.addExistingBook(currentUser, bookId);
        } else if (openLibraryBookId) {
          book = await this._bookService.addBook(
            currentUser,
            openLibraryBookId,
          );
        }
      }

      //create a new task
      const newTask = {
        _id: new ObjectId(),
        title: input.title,
        description: input.description,
        status: TaskStatus.NEW,
        priority: input.priority ? input.priority : TaskPriority.NONE,
        history: [],
        owner: currentUser._id,
        attachItem: {
          _id: book._id,
          openLibraryId: book.openLibraryId,
          title: book.title,
          authors: book.authors,
          subjects: book.subjects,
          covers: book.covers,
        } as BaseBookMongo,
      } as BaseTaskMongo;

      const createdTask = new this._taskModel(newTask);

      //auto-generate
      const TASK_HISTORY_DESC_FOR_NEW_TASK = `Task is created.`;
      const newTaskHistory = {
        _id: new ObjectId(),
        taskId: newTask._id,
        description: TASK_HISTORY_DESC_FOR_NEW_TASK,
        taskStatus: newTask.status,
        autoGenerated: true,
      };
      createdTask.history = [newTaskHistory];
      return await createdTask.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getTask(currentUser: BaseUserMongo, taskId: ObjectId): Promise<Task> {
    const userId = currentUser._id;
    try {
      const found = await this._taskModel.findById(taskId);
      if (found) {
        if (found.owner.equals(userId)) {
          return found;
        } else {
          throw new UnauthorizedException("Cannot view other user's task.");
        }
      } else {
        throw new NotFoundException(`Task with ObjectId ${taskId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateTask(
    currentUser: BaseUserMongo,
    taskId: ObjectId,
    input: UpdateTaskInput,
  ): Promise<Task> {
    const userId = currentUser._id;
    try {
      const found = await this._taskModel.findById(taskId);
      if (found) {
        if (found.owner.equals(userId)) {
          const {
            title,
            description,
            status,
            priority,
            bookId,
            openLibraryBookId,
          } = input;

          if (title && found.title !== title) {
            found.title = title;
          }

          if (description && found.description !== description) {
            found.description = description;
          }

          if (status && found.status !== status) {
            found.status = status;
          }

          if (priority && found.priority !== priority) {
            found.priority = priority;
          }

          let book: Book;
          if (bookId && openLibraryBookId) {
            if (!found.attachItem._id.equals(bookId)) {
              book = await this._bookService.addExistingBook(
                currentUser,
                bookId,
              );
            }
          } else if (bookId || openLibraryBookId) {
            if (bookId) {
              if (!found.attachItem._id.equals(bookId)) {
                book = await this._bookService.addExistingBook(
                  currentUser,
                  bookId,
                );
              }
            } else if (openLibraryBookId) {
              if (found.attachItem.openLibraryId !== openLibraryBookId) {
                book = book = await this._bookService.addBook(
                  currentUser,
                  openLibraryBookId,
                );
              }
            }
          }
          if (book) {
            found.attachItem = book;
          }

          return await found.save();
        } else {
          throw new UnauthorizedException("Cannot edit other user's task.");
        }
      } else {
        throw new NotFoundException(`Task with ObjectId ${taskId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async deleteTask(
    currentUser: BaseUserMongo,
    taskId: ObjectId,
  ): Promise<ObjectId> {
    const userId = currentUser._id;
    try {
      const found = await this._taskModel.findById(taskId);

      if (found) {
        if (found.owner.equals(userId)) {
          await found.deleteOne();
          return taskId;
        } else {
          throw new UnauthorizedException("Cannot delete other user's task.");
        }
      } else {
        throw new NotFoundException(`Task with ObjectId ${taskId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  //TASK-HISTORY
  async addTaskHistory(
    currentUser: BaseUserMongo,
    taskId: ObjectId,
    input: CreateTaskHistoryInput,
  ): Promise<TaskHistory> {
    const userId = currentUser._id;
    try {
      const found = await this._taskModel.findById(taskId);
      if (found) {
        if (found.owner.equals(userId)) {
          const newTaskHistory = {
            _id: new ObjectId(),
            description: input.description,
            taskId,
            taskStatus: found.status,
            autoGenerated: false,
          };
          found.history = [newTaskHistory, ...found.history];
          await found.save();
          return newTaskHistory;
        } else {
          throw new UnauthorizedException("Cannot edit other user's task.");
        }
      } else {
        throw new NotFoundException(`Task with ObjectId ${taskId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getTaskHistoryRelay(
    currentUser: BaseUserMongo,
    task: Task,
    pageDataConfig: PageDataConfig<null>,
  ): Promise<[TaskHistory[], number]> {
    const userId = currentUser._id;
    if (task.owner.equals(userId)) {
      let { limit, offset } = pageDataConfig;
      if (limit > MAX_TASK_HISTORY_PER_REQUEST) {
        limit = MAX_TASK_HISTORY_PER_REQUEST;
      }
      return [task.history.slice(offset, offset + limit), task.history.length];
    } else {
      throw new UnauthorizedException("Cannot view other user's task.");
    }
  }

  async updateTaskHistory(
    currentUser: BaseUserMongo,
    taskId: ObjectId,
    taskHistoryId: ObjectId,
    input: UpdateTaskHistoryInput,
  ): Promise<TaskHistory> {
    const userId = currentUser._id;
    try {
      const found = await this._taskModel.findById(taskId);
      if (found) {
        if (found.owner.equals(userId)) {
          const idx = found.history.findIndex((obj) =>
            obj._id.equals(taskHistoryId),
          );
          if (idx >= 0) {
            const toUpdate = found.history[idx];
            if (!toUpdate.autoGenerated) {
              const { description } = input;

              if (description) {
                toUpdate.description = description;
              }

              found.save();
              return found.history[idx];
            } else {
              throw new UnauthorizedException(
                'Cannot delete auto-generated task history.',
              );
            }
          } else {
            throw new NotFoundException(
              `TaskHistory with ObjectId ${taskHistoryId} not found.`,
            );
          }
        } else {
          throw new UnauthorizedException("Cannot edit other user's task.");
        }
      } else {
        throw new NotFoundException(`Task with ObjectId ${taskId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}

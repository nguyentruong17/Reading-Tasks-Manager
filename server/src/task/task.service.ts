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
import { CreateTaskInput } from './task.inputs';
import { Task, TaskDocument } from './task.model';
import { User } from 'src/user/user.model';
import { BaseBookMongo, Book } from 'src/book/book.model';
import { TaskStatus } from './task-status.enum';

//services
import { BookService } from 'src/book/book.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly _taskModel: Model<TaskDocument>,

    //@Inject(forwardRef(() => BookService))
    private readonly _bookService: BookService,
  ) {}
  async createTask(user: User, input: CreateTaskInput): Promise<Task> {
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
      if (bookId) {
        book = await this._bookService.addExistingBook(user, bookId);
      }

      if (openLibraryBookId) {
        book = await this._bookService.addBook(user, openLibraryBookId);
      }

      const newTask = {
        title: input.title,
        description: input.description,
        status: TaskStatus.OPEN,
        history: [],
        owner: user._id,
        attachItem: {
          _id: book._id,
          openLibraryId: book.openLibraryId,
          title: book.title,
          authors: book.authors,
          subjects: book.subjects,
          covers: book.covers,
        } as BaseBookMongo,
      };

      const createdTask = new this._taskModel(newTask);
      return await createdTask.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async deleteTask(
    currentUser: User,
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
          throw new UnauthorizedException();
        }
      } else {
        throw new NotFoundException(`Task with ObjectId ${taskId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}

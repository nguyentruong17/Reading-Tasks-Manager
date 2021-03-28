import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateTaskInput, UpdateTaskInput } from 'src/task/task.inputs';

//models + inputs + dtos
import {
  BaseUser,
  BaseUserMongo,
  UserTask,
  User,
  UserDocument,
} from './user.model';
import { Task } from 'src/task/task.model';
import { UserBookFilter, UserTaskFilter } from './user.filter';

//services
import { TaskService } from 'src/task/task.service';
import { BaseBookMongo } from 'src/book/book.model';
import ConnectionArgs from 'src/graphql/relay/connection.args';
import { TaskRelay } from 'src/task/task.response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    private readonly _taskService: TaskService,
  ) {}

  //USERS:
  async createUser(input: BaseUser): Promise<User> {
    try {
      const email = input.gmail;
      const found = await this._userModel.findOne({ gmail: email });

      if (found) {
        throw new BadRequestException(
          `User with email ${email} already existed`,
        );
      } else {
        const createdUser = new this._userModel({
          ...input,
          tasks: [], //initalizing,
          books: [], //initalizing
        });
        return await createdUser.save();
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  // async getUser(currentUser: BaseUserMongo, userId: ObjectId): Promise<User> {
  //   try {
  //     const found = await this._userModel.findById(userId);
  //     if (found) {
  //       return found;
  //     } else {
  //       throw new NotFoundException(`User with ObjectId ${userId} not found.`);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     throw new InternalServerErrorException(e);
  //   }
  // }

  //TASKS:
  async createTask(
    currentUser: BaseUserMongo,
    input: CreateTaskInput,
  ): Promise<Task> {
    try {
      const createdTask = await this._taskService.createTask(
        currentUser,
        input,
      );

      const found = await this._userModel.findByIdAndUpdate(
        currentUser._id,
        {
          $push: {
            tasks: {
              $each: [createdTask],
              $position: 0,
            },
          },

          // 'books.openLibraryBookId': {
          //   $ne: `${createdTask.attachItem.openLibraryId}`,
          // },
          $addToSet: {
            books: createdTask.attachItem,
          },
        },
        {
          new: true,
        },
      );

      if (found) {
        return createdTask;
      } else {
        //shouldnt happen, becauser the currentUser is retrieved from the db at authentication
        throw new InternalServerErrorException('Error');
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  // async getTask(currentUser: BaseUserMongo, taskId: ObjectId): Promise<Task> {
  //   const userId = currentUser._id;
  //   try {
  //     return await this._taskService.getTask(currentUser, taskId);
  //   } catch (e) {
  //     console.log(e);
  //     throw new InternalServerErrorException(e);
  //   }
  // }

  async getTask(
    currentUser: BaseUserMongo,
    taskId: ObjectId,
    args: ConnectionArgs,
  ): Promise<TaskRelay> {
    const userId = currentUser._id;
    try {
      return await this._taskService.getTaskRelay(currentUser, taskId, args);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getTasks(
    currentUser: BaseUserMongo,
    limit: number,
    offset: number,
    filter: UserTaskFilter | undefined,
  ): Promise<[UserTask[], number]> {
    const userId = currentUser._id;
    try {
      const found = await this._userModel.findById(userId);

      if (found) {
        const tasks = !!filter
          ? found.tasks.filter((task) => filter.isMatch(task))
          : found.tasks;
        return [tasks.slice(offset, offset + limit), tasks.length];
      } else {
        //shouldnt happen, becauser the currentUser is retrieved from the db at authentication
        throw new InternalServerErrorException('Error');
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async updateTask(
    currentUser: BaseUserMongo,
    input: UpdateTaskInput,
  ): Promise<Task> {
    const userId = currentUser._id;
    try {
      const updatedTask = await this._taskService.updateTask(
        currentUser,
        input,
      );

      const found = await this._userModel.findOneAndUpdate(
        { _id: userId, 'tasks._id': input.taskId },
        {
          $set: {
            'tasks.$': updatedTask,
          },
          $addToSet: {
            books: updatedTask.attachItem,
          },
        },
      );

      if (found) {
        return updatedTask;
      } else {
        //shouldnt happen, becauser the currentUser is retrieved from the db at authentication
        throw new InternalServerErrorException('Error');
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
      await this._taskService.deleteTask(currentUser, taskId);
      const found = await this._userModel.findByIdAndUpdate(userId, {
        $pull: {
          tasks: { _id: taskId },
        },
      });

      if (found) {
        return taskId;
      } else {
        //shouldnt happen, becauser the currentUser is retrieved from the db at authentication
        throw new InternalServerErrorException('Error');
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  //BOOKS
  async getBooks(
    currentUser: BaseUserMongo,
    limit: number,
    offset: number,
    filter: UserBookFilter | undefined,
  ): Promise<[BaseBookMongo[], number]> {
    const userId = currentUser._id;
    try {
      const found = await this._userModel.findById(userId);

      if (found) {
        const books = !!filter
          ? found.books.filter((book) => filter.isMatch(book))
          : found.books;
        return [books.slice(offset, offset + limit), books.length];
      } else {
        //shouldnt happen, becauser the currentUser is retrieved from the db at authentication
        throw new InternalServerErrorException('Error');
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}

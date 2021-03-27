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
import { BaseUser, BaseUserMongo, UserTask, User, UserDocument } from './user.model';
import { BaseTaskMongo, Task } from 'src/task/task.model';

//services
import { TaskService } from 'src/task/task.service';

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

  async getUser(currentUser: BaseUserMongo, userId: ObjectId): Promise<User> {
    try {
      const found = await this._userModel.findById(userId);
      if (found) {
        return found;
      } else {
        throw new NotFoundException(`User with ObjectId ${userId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

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
              $position: 0
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

  async getTask(currentUser: BaseUserMongo, taskId: ObjectId): Promise<Task> {
    const userId = currentUser._id;
    try {
      return await this._taskService.getTask(currentUser, taskId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getTasks(currentUser: BaseUserMongo): Promise<UserTask[]> {
    const userId = currentUser._id;
    try {
      const found = await this._userModel.findById(userId);
      if (found) {
        return found.tasks;
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
}

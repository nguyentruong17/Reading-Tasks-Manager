import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateTaskInput } from 'src/task/task.inputs';

//models + inputs + dtos
import { BaseUser, User, UserDocument } from './user.model';
import { Task } from 'src/task/task.model';

//services
import { TaskService } from 'src/task/task.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    private readonly _taskService: TaskService,
  ) {}

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

  async createTask(currentUser: User, input: CreateTaskInput): Promise<Task> {
    try {
      const createdTask = await this._taskService.createTask(
        currentUser,
        input,
      );
      // const tasks = [
      //   ...currentUser.tasks,
      //   createdTask
      // ]
      const found = await this._userModel.findByIdAndUpdate(
        currentUser._id,
        {
          $push: {
            tasks: createdTask,
          },

          'books.openLibraryBookId': { '$ne': `${createdTask.attachItem.openLibraryId}` },
          $addToSet: {
            books: createdTask.attachItem,
          },
        },
        {
          new: true,
        },
      );

      //console.log(found)

      if (found) {
        return createdTask;
      } else {
        //shouldnt happen, becauser the currentUser is retrieved from the db at authentication
        throw new InternalServerErrorException('Error');
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

//models + inputs + dtos
import { CreateTaskInput, UpdateTaskInput } from 'src/task/task.inputs';
import { Task } from 'src/task/task.model';
import { BaseUserMongo, User } from 'src/user/user.model';

//services
import { UserService } from './user.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators';

@Injectable()
@Resolver()
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  //USERS
  @Mutation((returns) => User)
  @UseGuards(GqlAuthGuard)
  async getUser(@CurrentUser() currentUser: BaseUserMongo): Promise<User> {
    return await this._userService.getUser(currentUser, currentUser._id);
  }

  //TASKS
  @Mutation((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async createTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('input') input: CreateTaskInput,
  ): Promise<Task> {
    return await this._userService.createTask(currentUser, input);
  }

  @Mutation((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async getTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('taskId') taskId: ObjectId,
  ): Promise<Task> {
    return await this._userService.getTask(currentUser, taskId);
  }

  @Mutation((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async updateTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('input') input: UpdateTaskInput,
  ): Promise<Task> {
    return await this._userService.updateTask(currentUser, input);
  }

  @Mutation((returns) => ObjectId)
  @UseGuards(GqlAuthGuard)
  async deleteTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('taskId') taskId: ObjectId,
  ): Promise<ObjectId> {
    return await this._userService.deleteTask(currentUser, taskId);
  }
}

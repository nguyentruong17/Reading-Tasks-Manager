import { Injectable, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

//models + inputs + dtos
import { CreateTaskInput, UpdateTaskInput } from 'src/task/task.inputs';
import { Task } from 'src/task/task.model';
import { BaseUserMongo } from 'src/user/user.model';
import { UserBooksResponse, UserTasksResponse } from './user.response';
import { UserBookFilter, UserTaskFilter } from './user.filter';
import {
  DEFAULT_USER_BOOKS_PER_QUERY,
  DEFAULT_USER_TASKS_PER_QUERY,
} from 'src/consts/defaults';

//services
import { UserService } from './user.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators';

//relay
import { connectionFromArraySlice } from 'graphql-relay';
import { UserTasksArgs, UserBooksArgs } from './user-connection.args';

@Injectable()
@Resolver()
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  //USERS
  // @Query((returns) => User)
  // @UseGuards(GqlAuthGuard)
  // async getUser(@CurrentUser() currentUser: BaseUserMongo): Promise<User> {
  //   return await this._userService.getUser(currentUser, currentUser._id);
  // }

  //TASKS
  @Mutation((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async createTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('input') input: CreateTaskInput,
  ): Promise<Task> {
    return await this._userService.createTask(currentUser, input);
  }

  @Query((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async getTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('taskId') taskId: ObjectId,
  ) {
    return await this._userService.getTask(currentUser, taskId);
  }

  @Query(() => UserTasksResponse)
  @UseGuards(GqlAuthGuard)
  public async getTasks(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args() args: UserTasksArgs,
  ): Promise<UserTasksResponse> {
    let { limit, offset, filter } = args.pagingParams();

    if (!limit) {
      limit = DEFAULT_USER_TASKS_PER_QUERY;
    }
    if (!offset) {
      offset = 0;
    }
    if (!filter) {
      filter = new UserTaskFilter();
    }
    const [tasks, count] = await this._userService.getTasksRelay(currentUser, {
      limit,
      offset,
      filter,
    });
    const page = connectionFromArraySlice(tasks, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Mutation((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async updateTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('taskId') taskId: ObjectId,
    @Args('input') input: UpdateTaskInput,
  ): Promise<Task> {
    return await this._userService.updateTask(currentUser, taskId, input);
  }

  @Mutation((returns) => ObjectId)
  @UseGuards(GqlAuthGuard)
  async deleteTask(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args('taskId') taskId: ObjectId,
  ): Promise<ObjectId> {
    return await this._userService.deleteTask(currentUser, taskId);
  }

  @Query(() => UserBooksResponse)
  @UseGuards(GqlAuthGuard)
  public async getBooks(
    @CurrentUser() currentUser: BaseUserMongo,
    @Args() args: UserBooksArgs,
  ): Promise<UserBooksResponse> {
    let { limit, offset, filter } = args.pagingParams();
    if (!limit) {
      limit = DEFAULT_USER_BOOKS_PER_QUERY;
    }
    if (!offset) {
      offset = 0;
    }
    if (!filter) {
      filter = new UserBookFilter();
    }
    const [books, count] = await this._userService.getBooksRelay(currentUser, {
      limit,
      offset,
      filter,
    });
    const page = connectionFromArraySlice(books, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }
}

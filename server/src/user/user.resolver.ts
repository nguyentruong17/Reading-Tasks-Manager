import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

//models + inputs + dtos
import { CreateTaskInput } from 'src/task/task.inputs';
import { Task } from 'src/task/task.model';
import { User } from 'src/user/user.model';

//services
import { UserService } from './user.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators';

@Injectable()
@Resolver()
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Mutation((returns) => Task)
  @UseGuards(GqlAuthGuard)
  async createTask(
    @CurrentUser() currentUser: User,
    @Args('input') input: CreateTaskInput,
  ): Promise<Task> {
    return await this._userService.createTask(currentUser, input);
  }

  @Mutation((returns) => ObjectId)
  @UseGuards(GqlAuthGuard)
  async deleteTask(
    @CurrentUser() currentUser: User,
    @Args('taskId') taskId: ObjectId,
  ): Promise<ObjectId> {
    const isValid = ObjectId.isValid(taskId);
    if (isValid) {
      return await this._userService.deleteTask(currentUser, new ObjectId(taskId));
    } else {
      throw new BadRequestException('taskId must be an ObjectId')
    }
  }
}

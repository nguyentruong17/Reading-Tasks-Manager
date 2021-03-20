import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { CreateTaskInput } from './task.inputs';
import { BaseTask, Task } from './task.model';
import { User } from 'src/user/user.model';

//services
import { TaskService } from './task.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators';

@Injectable()
@Resolver()
export class TaskResolver {
  // constructor(private readonly _taskService: TaskService) {}

  // @Mutation((returns) => Task)
  // @UseGuards(GqlAuthGuard)
  // async createTask(
  //   @CurrentUser() currentUser: User,
  //   @Args('input') input: CreateTaskInput,
  // ): Promise<Task> {
  //   return await this._taskService.createTask(currentUser, input);
  // }
}

import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { CreateTaskHistoryInput, UpdateTaskHistoryInput } from './task-history.inputs';
import { BaseTask, Task } from './task.model';
import { User } from 'src/user/user.model';

//services
import { TaskService } from './task.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators';
import { TaskHistory } from './task-history.model';

@Injectable()
@Resolver()
export class TaskResolver {
  constructor(private readonly _taskService: TaskService) {}

  // @Mutation((returns) => Task)
  // @UseGuards(GqlAuthGuard)
  // async createTask(
  //   @CurrentUser() currentUser: User,
  //   @Args('input') input: CreateTaskInput,
  // ): Promise<Task> {
  //   return await this._taskService.createTask(currentUser, input);
  // }

  @Mutation((returns) => TaskHistory)
  @UseGuards(GqlAuthGuard)
  async addTaskHistory(
    @CurrentUser() currentUser: User,
    @Args('input') input: CreateTaskHistoryInput,
  ): Promise<TaskHistory> {
    return await this._taskService.addTaskHistory(currentUser, input);
  }

  @Mutation((returns) => TaskHistory)
  @UseGuards(GqlAuthGuard)
  async updateTaskHistory(
    @CurrentUser() currentUser: User,
    @Args('input') input: UpdateTaskHistoryInput,
  ): Promise<TaskHistory> {
    return await this._taskService.updateTaskHistory(currentUser, input);
  }
}

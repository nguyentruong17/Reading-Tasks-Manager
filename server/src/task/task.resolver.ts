import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { CreateTaskHistoryInput, UpdateTaskHistoryInput } from './task-history.inputs';
import { User } from 'src/user/user.model';
import { Task } from './task.model';
import { TaskHistory } from './task-history.model';
import { TaskHistoryResponse } from './task.response';
import { DEFAULT_TASK_HISTORY_PER_REQUEST, MAX_TASK_HISTORY_PER_REQUEST } from 'src/consts/defaults';

//services
import { TaskService } from './task.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators';

//relay
import { connectionFromArraySlice } from 'graphql-relay';
import ConnectionArgs from 'src/graphql/relay/connection.args';
import { ObjectId } from 'mongodb';


@Injectable()
@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly _taskService: TaskService) {}

  @Mutation((returns) => TaskHistory)
  @UseGuards(GqlAuthGuard)
  async addTaskHistory(
    @CurrentUser() currentUser: User,
    @Args('taskId') taskId: ObjectId,
    @Args('input') input: CreateTaskHistoryInput,
  ): Promise<TaskHistory> {
    return await this._taskService.addTaskHistory(currentUser, taskId, input);
  }

  @Mutation((returns) => TaskHistory)
  @UseGuards(GqlAuthGuard)
  async updateTaskHistory(
    @CurrentUser() currentUser: User,
    @Args('taskId') taskId: ObjectId,
    @Args('taskHistoryId') taskHistoryId: ObjectId,
    @Args('input') input: UpdateTaskHistoryInput,
  ): Promise<TaskHistory> {
    return await this._taskService.updateTaskHistory(currentUser, taskId, taskHistoryId, input);
  }

  @ResolveField('history', (returns) => TaskHistoryResponse)
  @UseGuards(GqlAuthGuard)
  async getTaskHistory(@Parent() task: Task, @Args() args: ConnectionArgs) {
    let { limit, offset } = args.pagingParams();

    if (!limit) {
      limit = DEFAULT_TASK_HISTORY_PER_REQUEST;
    }
    if (limit && limit > MAX_TASK_HISTORY_PER_REQUEST) {
      limit = MAX_TASK_HISTORY_PER_REQUEST;
    }
    if (!offset) {
      offset = 0;
    }

    const history = task.history.slice(offset, offset + limit);
    const count = task.history.length;

    const page = connectionFromArraySlice(history, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

}

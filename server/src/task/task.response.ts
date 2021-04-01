import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import relayTypes from 'src/graphql/relay/relay.types';
import { TaskHistory } from './task-history.model';
import { BaseTask, BaseTaskMongo, Task } from './task.model';
import { BaseBookMongo } from 'src/book/book.model';

//task-history
@ObjectType()
export class TaskHistoryResponse extends relayTypes<TaskHistory>(TaskHistory) {}

//tasks
// @ObjectType({
//   description:
//     'A relay-style type for Task. The only difference is in the `history` field: [TaskHistory] -> TaskHistoryResponse.',
// })
// export class TaskRelay extends BaseTaskMongo {
//   @Field((types) => TaskHistoryResponse)
//   history: TaskHistoryResponse;

//   @Field()
//   owner: ObjectId;

//   @Field((type) => BaseBookMongo)
//   attachItem: BaseBookMongo;
// }

// @ObjectType({ description: 'A relay-style response type for Task.' })
// export class TaskRelayResponse extends relayTypes<TaskRelay>(TaskRelay) {}

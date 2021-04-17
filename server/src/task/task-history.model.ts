import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from '@nestjs/graphql';

import { TaskStatus } from './task-status.enum';

export const BASE_TASK_HISTORY_MODEL_NAME = 'BaseTaskHistory';
export const BASE_TASK_HISTORY_MONGO_MODEL_NAME = 'BaseTaskHistoryMongo';
export const TASK_HISTORY_MODEL_NAME = 'TaskHistory';

@Schema({ discriminatorKey: 'title', _id: false })
@ObjectType()
export class BaseTaskHistory {
  @Prop({ required: true, type: () => String })
  @Field()
  description: string;

  @Prop({ required: true, type: () => Boolean })
  @Field()
  autoGenerated: boolean;
}
Object.defineProperty(BaseTaskHistory, 'name', {
  value: BASE_TASK_HISTORY_MODEL_NAME,
  writable: false,
});

@Schema({ discriminatorKey: '_id' })
@ObjectType()
export class BaseTaskHistoryMongo extends BaseTaskHistory {
  @Field()
  readonly _id: ObjectId;
}
Object.defineProperty(BaseTaskHistoryMongo, 'name', {
  value: BASE_TASK_HISTORY_MONGO_MODEL_NAME,
  writable: false,
});

@Schema()
@ObjectType()
export class TaskHistory extends BaseTaskHistoryMongo {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  @Field()
  taskId: ObjectId;

  @Prop({ required: true, type: () => String })
  @Field((types) => TaskStatus)
  taskStatus: TaskStatus;
}
Object.defineProperty(TaskHistory, 'name', {
  value: TASK_HISTORY_MODEL_NAME,
  writable: false,
});

//export type TaskHistoryDocument = TaskHistory & Document;
export const TaskHistorySchema = SchemaFactory.createForClass(TaskHistory);

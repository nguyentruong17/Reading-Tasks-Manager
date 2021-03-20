import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from 'src/graphql/scalars/ObjectIdScalar';

import { TaskStatus } from './task-status.enum';
import { TaskHistory, TaskHistorySchema } from './task-history.model';
import { BaseBookMongo, BaseBookMongoSchema } from 'src/book/book.model';

export const BASE_TASK_MODEL_NAME = 'BaseTask';
export const BASE_TASK_MONGO_MODEL_NAME = 'BaseTask';
export const TASK_MODEL_NAME = 'Task';

@Schema({ discriminatorKey: 'title', _id: false }) //could be anything, just because I want to extends this class
@ObjectType()
export class BaseTask { //base class
  
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Prop({ required: true })
  @Field((types) => String)
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Prop({ required: true })
  @Field()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  @Field((types) => String)
  status: TaskStatus;

  @IsArray()
  @IsNotEmpty()
  @Prop({ type: [TaskHistorySchema], required: true })
  @Field((types) => [TaskHistory])
  history: TaskHistory[]
}
Object.defineProperty(BaseTask, 'name', {
  value: BASE_TASK_MODEL_NAME,
  writable: false
});

@Schema({ discriminatorKey: '_id' })
@ObjectType()
export class BaseTaskMongo extends BaseTask { 
  @Field()
  readonly _id: ObjectId;
}
Object.defineProperty(BaseTaskMongo, 'name', {
  value: BASE_TASK_MONGO_MODEL_NAME,
  writable: false
});
export const BaseTaskMongoSchema = SchemaFactory.createForClass(BaseTaskMongo);


@Schema()
@ObjectType()
export class Task extends BaseTaskMongo {

  @IsString()
  @IsNotEmpty()
  @Prop({ type: MongooseSchema.Types.ObjectId })
  @Field()
  owner: ObjectId;

  @IsNotEmpty()
  @Prop({ type: BaseBookMongoSchema })
  @Field((type) => BaseBookMongo)
  attachItem: BaseBookMongo;
}
Object.defineProperty(Task, 'name', {
  value: TASK_MODEL_NAME,
  writable: false
});

export type TaskDocument = Task & Document;

export const TaskSchema = SchemaFactory.createForClass(Task);
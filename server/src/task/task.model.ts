import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';


//import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';
import { TaskStatus } from './task-status.enum';
import { TaskHistory } from './task-history.model';
import { BaseBook, BASE_BOOK_NAME } from 'src/book/book.model';

export const BASE_TASK_NAME = 'BaseTask';
export const TASK_NAME = 'Task';

@Schema({ discriminatorKey: 'title' }) //could be anything, just because I want to extends this class
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
  @Prop({ type: () => [TaskHistory], required: true })
  @Field((types) => [TaskHistory])
  history: TaskHistory[]
}

Object.defineProperty(BaseTask, 'name', {
  value: BASE_TASK_NAME,
  writable: false
});


@Schema()
@ObjectType()
export class Task extends BaseTask {

  @Field((type) => String) //how to use ObjectIdScalar?
  readonly _id: MongooseSchema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @Prop({ type: MongooseSchema.Types.ObjectId })
  @Field((type) => String)
  owner: MongooseSchema.Types.ObjectId;

  @IsNotEmpty()
  @Prop({ type: () => MongooseSchema.Types.ObjectId, ref: `${BASE_BOOK_NAME}` })
  @Field((type) => BaseBook)
  attachItem: BaseBook;
}

Object.defineProperty(Task, 'name', {
  value: TASK_NAME,
  writable: false
});

export type TaskDocument = Task & Document;

export const TaskSchema = SchemaFactory.createForClass(Task);
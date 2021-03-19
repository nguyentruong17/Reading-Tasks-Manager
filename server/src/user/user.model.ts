import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Field,
  ObjectType,
  Int,
  InputType,
} from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { BASE_BOOK_NAME, BaseBook } from 'src/book/book.model';
import { TASK_NAME, Task } from 'src/task/task.model';


//import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';

export const BASE_USER_NAME = 'BaseUser'
export const USER_NAME = 'User'

@Schema({ discriminatorKey: 'googleId' }) //could be anything, just because I want to extends this class
@ObjectType()
@InputType('CreateUserInput')
export class BaseUser {

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: () => String })
  @Field((type) => String)
  googleId: string;

  @IsEmail()
  @IsNotEmpty()
  @Prop({ required: true, unique: true, type: () => String })
  @Field((type) => String)
  gmail: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: () => String })
  @Field((type) => String)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: () => String })
  @Field((type) => String)
  lastName: string;
}

Object.defineProperty(BaseUser, 'name', {
  value: BASE_USER_NAME,
  writable: false
});

@Schema()
@ObjectType()
export class User extends BaseUser {
  
  @Field((type) => String)
  readonly _id?: MongooseSchema.Types.ObjectId;

// to-be-implemented
//   @IsString()
//   @Prop({ required: true, type: () => String })
//   @Field((type) => String)
//   username: string;

  @IsNumber()
  @IsNotEmpty()
  
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: `${TASK_NAME}` }]  })
  @Field((type) => [Task])
  tasks: Task[];

  @IsNotEmpty()
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: `${BASE_BOOK_NAME}` }] })
  @Field((type) => [BaseBook])
  books: BaseBook[];
}

Object.defineProperty(User, 'name', {
  value: USER_NAME,
  writable: false
});

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

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
import { ObjectId } from 'mongodb';

import { BaseBookMongoSchema, BaseBookMongo } from 'src/book/book.model';
import { TaskSchema, Task } from 'src/task/task.model';

export const BASE_USER_MODEL_NAME = 'BaseUser';
export const BASE_USER_MONGO_MODEL_NAME = 'BaseUserMongo';
export const USER_NAME = 'User'

@Schema({ discriminatorKey: 'googleId', _id: false }) //could be anything, just because I want to extends this class
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
  value: BASE_USER_MODEL_NAME,
  writable: false
});

@Schema({ discriminatorKey: '_id' })
@ObjectType()
export class BaseUserMongo extends BaseUser { 
  @Field()
  readonly _id: ObjectId;
}
Object.defineProperty(BaseUserMongo, 'name', {
  value: BASE_USER_MONGO_MODEL_NAME,
  writable: false
});
export const BaseUserMongoSchema = SchemaFactory.createForClass(BaseUserMongo);

@Schema()
@ObjectType()
export class User extends BaseUserMongo {

// to-be-implemented
//   @IsString()
//   @Prop({ required: true, type: () => String })
//   @Field((type) => String)
//   username: string;

  @IsArray()
  @Prop({ type:() => [TaskSchema] })
  @Field((type) => [Task])
  tasks: Array<Task>;

  @IsArray()
  @Prop({ type: [BaseBookMongoSchema] })
  @Field((type) => [BaseBookMongoSchema])
  books: Array<BaseBookMongo>;
}
Object.defineProperty(User, 'name', {
  value: USER_NAME,
  writable: false
});

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

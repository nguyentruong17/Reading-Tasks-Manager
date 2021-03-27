import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import {
  BaseBookMongoSchema,
  BaseBookMongo,
  BaseBookIdentifiers,
  BaseBookIdentifiersSchema,
} from 'src/book/book.model';
import { BaseTaskMongoSchema, BaseTaskMongo } from 'src/task/task.model';

export const BASE_USER_MODEL_NAME = 'BaseUser';
export const BASE_USER_MONGO_MODEL_NAME = 'BaseUserMongo';
export const USER_NAME = 'User';

@Schema({ discriminatorKey: 'googleId', _id: false }) //could be anything, just because I want to extends this class
@ObjectType(BASE_USER_MODEL_NAME)
@InputType('CreateUserInput')
export class BaseUser {
  @Prop({ required: true, unique: true, type: () => String })
  @Field()
  googleId: string;

  @Prop({ required: true, unique: true, type: () => String })
  @Field()
  gmail: string;

  @Prop({ required: true, type: () => String })
  @Field()
  firstName: string;

  @Prop({ required: true, type: () => String })
  @Field()
  lastName: string;
}
Object.defineProperty(BaseUser, 'name', {
  value: BASE_USER_MODEL_NAME,
  writable: false,
});

@Schema({ discriminatorKey: '_id' })
@ObjectType(BASE_USER_MONGO_MODEL_NAME)
export class BaseUserMongo extends BaseUser {
  @Field()
  readonly _id: ObjectId;
}
Object.defineProperty(BaseUserMongo, 'name', {
  value: BASE_USER_MONGO_MODEL_NAME,
  writable: false,
});
export const BaseUserMongoSchema = SchemaFactory.createForClass(BaseUserMongo);

@Schema()
@ObjectType()
export class UserTask extends BaseTaskMongo {
  @Prop({ type: BaseBookIdentifiersSchema })
  @Field((type) => BaseBookIdentifiers)
  attachItem: BaseBookIdentifiers;
}
export const UserTaskSchema = SchemaFactory.createForClass(UserTask);

@Schema()
@ObjectType(USER_NAME)
export class User extends BaseUserMongo {
  // to-be-implemented
  //   @IsString()
  //   @Prop({ required: true, type: () => String })
  //   @Field((type) => String)
  //   username: string;

  @Prop({ type: [UserTaskSchema] })
  @Field((type) => [UserTask])
  tasks: Array<UserTask>;

  @Prop({ type: [BaseBookMongoSchema] })
  @Field((type) => [BaseBookMongo])
  books: Array<BaseBookMongo>;
}
Object.defineProperty(User, 'name', {
  value: USER_NAME,
  writable: false,
});

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

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
  GraphQLISODateTime,
  InputType,
} from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ discriminatorKey: 'googleId' }) //could be anything, just because I want to extends this class
@ObjectType()
@InputType('CreateUserInput')
export class BaseUser {
  @IsString()
  @Prop({ required: true, unique: true, type: () => String })
  @Field((type) => String)
  googleId: string;

  @IsEmail()
  @Prop({ required: true, unique: true, type: () => String })
  @Field((type) => String)
  gmail: string;

  @IsString()
  @Prop({ required: true, type: () => String })
  @Field((type) => String)
  firstName: string;

  @IsString()2
  @Prop({ required: true, type: () => String })
  @Field((type) => String)
  lastName: string;
}

@Schema()
@ObjectType()
export class User extends BaseUser {
  readonly name = 'USER';
  
  @Field((type) => String)
  readonly _id?: MongooseSchema.Types.ObjectId;

// to-be-implemented
//   @IsString()
//   @Prop({ required: true, type: () => String })
//   @Field((type) => String)
//   username: string;

  @IsDateString()
  @Prop({ required: true, type: () => Date })
  @Field((type) => GraphQLISODateTime)
  firstAppearDate: string;

  //will change to references
  @IsNumber()
  @Prop({ type: () => Number })
  @Field((type) => Int)
  tasks: number;

  //will change to references
  @IsNumber()
  @Prop({ type: () => Number })
  @Field((type) => Int)
  books: number;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

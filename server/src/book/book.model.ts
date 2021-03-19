import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/user.model';

//import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';

export const BASE_BOOK_NAME = 'BaseBook';
export const BOOK_NAME = 'Book';

@Schema({ discriminatorKey: 'openLibraryId' }) //could be anything, just because I want to extends this class
@ObjectType()
export class BaseBook { //base class
  
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  @Field()
  openLibraryId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Prop({ required: true })
  @Field()
  title: string;

  @IsArray()
  @Prop({ type: () => [String] })
  @Field((type) => [String])
  authors: Array<string>;

  @IsArray()
  @Prop({ type: () => [String] })
  @Field((type) => [String])
  subjects: Array<string>;

  @IsArray()
  @Prop({ type: () => [String] })
  @Field((type) => [String])
  covers: Array<string>;

}

Object.defineProperty(BaseBook, 'name', {
  value: BASE_BOOK_NAME,
  writable: false
});

//export const BookSchema = SchemaFactory.createForClass(Book); //we're not going to use this schema

@Schema()
@ObjectType()
export class Book extends BaseBook {

  @Field((type) => ID) // how to use the objectid scalar?
  readonly _id?: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: `${User.name}` })
  @Field((type) => [String])
  owners: MongooseSchema.Types.ObjectId[];

  @IsNumber()
  @Prop({ type: () => Number })
  @Field((type) => Int)
  timesAdded: number;
}

Object.defineProperty(Book, 'name', {
  value: BOOK_NAME,
  writable: false
});

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);

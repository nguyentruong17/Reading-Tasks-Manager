import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

//import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';

export const BASE_BOOK_MODEL_NAME = 'BaseBook';
export const BASE_BOOK_MONGO_MODEL_NAME = 'BaseBookMongo';
export const BOOK_MODEL_NAME = 'Book';

@Schema({ discriminatorKey: 'openLibraryId', _id: false }) //could be anything, just because I want to extends this class
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
  value: BASE_BOOK_MODEL_NAME,
  writable: false
});

@Schema({ discriminatorKey: '_id' })
@ObjectType()
export class BaseBookMongo extends BaseBook { 
  @Field((type) => ID) // how to use the objectid scalar?
  readonly _id: MongooseSchema.Types.ObjectId;
}
Object.defineProperty(BaseBookMongo, 'name', {
  value: BASE_BOOK_MONGO_MODEL_NAME,
  writable: false
});
export const BaseBookMongoSchema = SchemaFactory.createForClass(BaseBookMongo);


@Schema()
@ObjectType()
export class Book extends BaseBookMongo {

  @Prop({ type: [MongooseSchema.Types.ObjectId] })
  @Field((type) => [String])
  owners: MongooseSchema.Types.ObjectId[];

  @IsNumber()
  @Prop({ type: () => Number })
  @Field((type) => Int)
  timesAdded: number;
}
Object.defineProperty(Book, 'name', {
  value: BOOK_MODEL_NAME,
  writable: false
});

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);

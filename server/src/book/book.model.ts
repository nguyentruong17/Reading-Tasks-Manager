import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

export const BASE_BOOK_MODEL_NAME = 'BaseBook';
export const BASE_BOOK_MONGO_MODEL_NAME = 'BaseBookMongo';
export const BOOK_MODEL_NAME = 'Book';

@Schema({ discriminatorKey: 'openLibraryId', _id: false }) //could be anything, just because I want to extends this class
@ObjectType()
export class BaseBook { //base class

  @Prop({ required: true, unique: true })
  @Field()
  openLibraryId: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ type: () => [String] })
  @Field((type) => [String])
  authors: Array<string>;

  @Prop({ type: () => [String] })
  @Field((type) => [String])
  subjects: Array<string>;

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
  @Field()
  readonly _id: ObjectId;
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
  @Field((type) => [ID]) //@Field((type) => [ObjectId]) doesnt work
  owners: Array<ObjectId>;

  @Prop({ type: () => Number })
  @Field()
  timesAdded: number;
}
Object.defineProperty(Book, 'name', {
  value: BOOK_MODEL_NAME,
  writable: false
});

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);

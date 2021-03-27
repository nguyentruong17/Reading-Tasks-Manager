//mongo + mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';

//graphql
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { ObjectIdScalar } from 'src/graphql/scalars/ObjectIdScalar'

export const BASE_BOOK_IDENTIFIERS_MODEL_NAME = 'BaseBookIdentifiers';
export const BASE_BOOK_MODEL_NAME = 'BaseBook';
export const BASE_BOOK_MONGO_MODEL_NAME = 'BaseBookMongo';
export const BOOK_MODEL_NAME = 'Book';

@Schema({ discriminatorKey: 'openLibraryId', _id: false }) //could be anything, just because I want to extends this class
@ObjectType(BASE_BOOK_IDENTIFIERS_MODEL_NAME)
export class BaseBookIdentifiers { //base class

  @Prop({ required: true, unique: true })
  @Field()
  openLibraryId: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ type: () => [String] })
  @Field((types) => [String])
  authors: Array<string>;
}
Object.defineProperty(BaseBookIdentifiers, 'name', {
  value: BASE_BOOK_IDENTIFIERS_MODEL_NAME,
  writable: false
});
export const BaseBookIdentifiersSchema = SchemaFactory.createForClass(BaseBookIdentifiers);

@Schema({ discriminatorKey: 'subjects', _id: false }) //could be anything, just because I want to extends this class
@ObjectType(BASE_BOOK_MODEL_NAME)
export class BaseBook extends BaseBookIdentifiers { //base class
  @Prop({ type: () => [String] })
  @Field((types) => [String])
  subjects: Array<string>; //moving this from BaseBook is intentional

  @Prop({ type: () => [[String]] })
  @Field((types) => [[String]])
  covers: Array<Array<string>>; //moving this from BaseBook is intentional
}
Object.defineProperty(BaseBook, 'name', {
  value: BASE_BOOK_MODEL_NAME,
  writable: false
});

@Schema({ discriminatorKey: '_id' })
@ObjectType(BASE_BOOK_MONGO_MODEL_NAME)
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
@ObjectType(BOOK_MODEL_NAME)
export class Book extends BaseBookMongo {

  @Prop({ type: [MongooseSchema.Types.ObjectId] })
  @Field((types) => [ID]) //@Field((type) => [ObjectId]) doesnt work
  owners: Array<ObjectId>;

  @Prop({ type: () => Number })
  @Field((types) => Int)
  timesAdded: number;
}
Object.defineProperty(Book, 'name', {
  value: BOOK_MODEL_NAME,
  writable: false
});

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);

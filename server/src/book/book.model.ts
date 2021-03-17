import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, Int, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

//import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';

@Schema({ discriminatorKey: 'openLibraryId' }) //could be anything, just because I want to extends this class
@ObjectType()
@InputType('CreateBookInput')
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

  // @IsNumber()
  // @Prop({ type: () => Number })
  // @Field((type) => Int)
  // firstPublishYear: number;

  @IsArray()
  @Prop({ type: () => [String] })
  @Field((type) => [String])
  covers: Array<string>;

}

//export const BookSchema = SchemaFactory.createForClass(Book); //we're not going to use this schema

@Schema()
@ObjectType()
export class Book extends BaseBook {

  readonly name = 'BOOK';

  @Field((type) => String)
  readonly _id?: MongooseSchema.Types.ObjectId;
  
  @IsDateString()
  @Prop({ required: true, type: () => Date })
  @Field((type) => GraphQLISODateTime)
  firstAppearDate: string;

  @IsNumber()
  @Prop({ type: () => Number })
  @Field((type) => Int)
  timesAdded: number;
}

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);

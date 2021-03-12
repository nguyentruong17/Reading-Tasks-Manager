import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

//import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';

@ObjectType()
@Schema()
@InputType("BookInput")
export class Book {
  
  @Field((type) => String, {nullable: true})
  readonly _id: MongooseSchema.Types.ObjectId;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Prop({ required: true })
  @Field()
  openLibId: string;


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

  // @IsArray()
  // @Prop({ type: () => [String] })
  // @Field((type) => [String])
  // subjects: Array<string>;

  // @IsNumber()
  // @Prop({ type: () => Number })
  // @Field((type) => Int)
  // firstPublishYear: number;

  // @IsDateString()
  // @Prop({ required: true, type: () => Date })
  // @Field()
  // firstAppearDate: Date;
}

export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);

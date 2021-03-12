import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { prop } from '@typegoose/typegoose';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { ObjectIDScalar } from '../graphql/scalars/ObjectIDScalar';

@ObjectType()
@InputType("BookInput")
export class Book {
  
  @Field((type) => ObjectIDScalar, {nullable: true})
  readonly _id: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @prop({ required: true })
  @Field()
  openLibId: string;


  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @prop({ required: true })
  @Field()
  title: string;

  @IsArray()
  @prop({ type: () => [String] })
  @Field((type) => [String])
  authors: Array<string>;

  // @IsArray()
  // @prop({ type: () => [String] })
  // @Field((type) => [String])
  // subjects: Array<string>;

  // @IsNumber()
  // @prop({ type: () => Number })
  // @Field((type) => Int)
  // firstPublishYear: number;

  // @IsDateString()
  // @prop({ required: true, type: () => Date })
  // @Field()
  // firstAppearDate: Date;
}

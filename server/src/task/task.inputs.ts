import { InputType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

//import { ObjectIDScalar } from 'src/graphql/scalars/ObjectIDScalar';

@InputType('CreateTaskInput')
export class CreateTaskInput {

  @IsString()
  //@Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Field()
  description: string;

  @IsOptional()
  @Field({ nullable: true })
  bookId: ObjectId;

  @IsOptional()
  @Field((type) => String, { nullable: true })
  openLibraryBookId: string;
}

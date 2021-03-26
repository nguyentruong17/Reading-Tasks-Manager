import { InputType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus } from './task-status.enum';

@InputType('CreateTaskInput')
export class CreateTaskInput {

  @IsString()
  @Transform(({ value }) => value.trim())
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
  bookId?: ObjectId;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  openLibraryBookId?: string;
}


@InputType('UpdateTaskInput')
export class UpdateTaskInput {
  @Field()
  taskId: ObjectId;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsIn([...Object.values(TaskStatus)])
  @Field((types) => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @IsOptional()
  @Field({ nullable: true })
  bookId?: ObjectId;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  openLibraryBookId?: string;
}

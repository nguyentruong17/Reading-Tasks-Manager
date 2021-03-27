import { InputType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus } from './task-status.enum';
import { TaskPriority } from './task-priority.enum';

@InputType('CreateTaskInput')
export class CreateTaskInput {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(100)
  @Field()
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Field()
  description: string;

  @IsOptional()
  @IsIn([...Object.values(TaskPriority)])
  @Field((types) => TaskPriority, { nullable: true })
  priority?: TaskPriority;

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
  @IsIn([...Object.values(TaskPriority)])
  @Field((types) => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @IsOptional()
  @Field({ nullable: true })
  bookId?: ObjectId;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  openLibraryBookId?: string;
}

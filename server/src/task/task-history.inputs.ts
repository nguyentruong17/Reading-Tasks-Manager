import { InputType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType('CreateTaskHistoryInput')
export class CreateTaskHistoryInput {
  @Field()
  taskId: ObjectId;
  
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
}

@InputType('UpdateTaskHistoryInput')
export class UpdateTaskHistoryInput {
  @Field()
  taskId: ObjectId;

  @Field()
  taskHistoryId: ObjectId;

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
}

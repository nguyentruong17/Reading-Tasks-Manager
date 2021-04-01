import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType('CreateTaskHistoryInput')
export class CreateTaskHistoryInput {
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

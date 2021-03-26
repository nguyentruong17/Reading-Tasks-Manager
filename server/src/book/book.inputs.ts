import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType('SearchBookInput')
export class SearchBookInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  author?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field(() => String, { nullable: true })
  subject?: string;

  constructor(title: string, author: string, subject: string) {
      this.title = title;
      this.author = author;
      this.subject = subject;
  }

  equals(other: SearchBookInput): boolean {
    if (this.title == other.title &&
        this.author == other.author &&
        this.subject == other.subject) {
            return true
        }
    return false
  }
}

@InputType('CreateBookInput') 
export class CreateBookInput  { 
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Field()
  openLibraryBookId: string;
}

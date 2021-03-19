import { Field, InputType, Int } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Book } from './book.model';

@InputType('SearchBookInput')
export class SearchBookInput {
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  author?: string;

  @IsString()
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
  @Field(() => String)
  openLibraryBookId: string;
}

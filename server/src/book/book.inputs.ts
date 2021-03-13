import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
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

// @InputType('CreateBookInput') 
// export class CreateBookInput extends Book { 
  //the reason for not using this is graphql seems to recognizes this as empty
  //athough it supports inheritance...

// }

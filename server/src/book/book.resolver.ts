import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from './book.model';
import { BookService } from './book.service';

@Injectable()
@Resolver()
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query((returns) => [Book])
  async books() {
    return await this.bookService.getBooks();
  }

  @Mutation((returns) => Book)
  async addBook(@Args('input') book: Book): Promise<Book> {
    //console.log(book)
    return await this.bookService.addBook(book);
  }
}

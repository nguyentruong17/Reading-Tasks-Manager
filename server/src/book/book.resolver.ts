import { Injectable } from '@nestjs/common';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
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
  async addBook(@Arg('input') book: Book): Promise<Book> {
    //console.log(book)
    return await this.bookService.addBook(book);
  }
}

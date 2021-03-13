import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { SearchBookInput } from './book.inputs';
import { AddedBook, Book } from './book.model';

//services
import { BookService } from './book.service';

@Injectable()
@Resolver()
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query((returns) => [Book])
  async searchOnlineBooks(@Args('input') searchInput: SearchBookInput): Promise<Book[]> {
    return await this.bookService.searchOnlineBooks(searchInput);
  }

  @Query((returns) => [AddedBook])
  async getBooks(): Promise<AddedBook[]> {
    return await this.bookService.getBooks();
  }

  @Mutation((returns) => AddedBook)
  async addBook(@Args('input') book: Book): Promise<AddedBook> {
    return await this.bookService.addBook(book);
  }
}

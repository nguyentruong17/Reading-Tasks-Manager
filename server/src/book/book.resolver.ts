import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { SearchBookInput } from './book.inputs';
import { BaseBook, Book } from './book.model';

//services
import { BookService } from './book.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard'

@Injectable()
@Resolver()
export class BookResolver {
  constructor(private readonly _bookService: BookService) {}

  @Query((returns) => [BaseBook])
  @UseGuards(GqlAuthGuard)
  async searchOnlineBooks(@Args('input') searchInput: SearchBookInput): Promise<BaseBook[]> {
    return await this._bookService.searchOnlineBooks(searchInput);
  }

  @Query((returns) => [Book])
  @UseGuards(GqlAuthGuard)
  async getBooks(): Promise<Book[]> {
    return await this._bookService.getBooks();
  }

  //i think the addBook method should accept only the book's openlib id
  //then the service is going to connect to openlib's book api and fill in the information
  //TO-DO
  @Mutation((returns) => Book)
  @UseGuards(GqlAuthGuard)
  async addBook(@Args('input') book: BaseBook): Promise<Book> {
    return await this._bookService.addBook(book);
  }
}

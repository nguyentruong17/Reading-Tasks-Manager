import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

//models + inputs + dtos
import { CreateBookInput, SearchBookInput } from './book.inputs';
import { BaseBook, Book } from './book.model';
import { User } from 'src/user/user.model'; //to-be removed

//services
import { BookService } from './book.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';
import { CurrentUser } from 'src/auth/auth-gql.decorators'; //to-be removed



@Injectable()
@Resolver()
export class BookResolver {
  constructor(private readonly _bookService: BookService) {}

  @Query((returns) => [BaseBook])
  @UseGuards(GqlAuthGuard)
  async searchOnlineBooks(
    @Args('input') searchInput: SearchBookInput,
  ): Promise<BaseBook[]> {
    return await this._bookService.searchOpenLibraryBooks(searchInput);
  }

  @Query((returns) => [Book])
  @UseGuards(GqlAuthGuard)
  async getBooks(): Promise<Book[]> {
    return await this._bookService.getBooks();
  }

  //to-be removed
  // @Mutation((returns) => Book)
  // @UseGuards(GqlAuthGuard)
  // async createBook(
  //   @CurrentUser() currentUser: User,
  //   @Args('input') createBookInput: CreateBookInput,
  // ): Promise<Book> {
  //   return await this._bookService.createBook(currentUser, createBookInput);
  // }
}

import { Injectable, UseGuards } from '@nestjs/common';
import {
  Args,
  ArgsType,
  Field,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

//models + inputs + dtos
import { SearchBookInput } from './book.inputs';
import { BaseBook } from './book.model';

//services
import { BookService } from './book.service';

//guards
import { GqlAuthGuard } from 'src/auth/auth-gql.guard';

//relay
import { connectionFromArraySlice } from 'graphql-relay';
import { BookArgs } from './book-connection.args';
import { BookResponse } from './book.response';

@Injectable()
@Resolver()
export class BookResolver {
  constructor(private readonly _bookService: BookService) {}

  @Query((returns) => [BaseBook])
  @UseGuards(GqlAuthGuard)
  async searchOnlineBooks(
    @Args('input') searchInput: SearchBookInput,
    @Args('offset', { defaultValue: 0 }) offset?: number,
    @Args('limit', { defaultValue: 5 }) limit?: number,
  ): Promise<BaseBook[]> {
    return await this._bookService.searchOpenLibraryBooks(searchInput, offset, limit);
  }

  @Query((returns) => BookResponse)
  @UseGuards(GqlAuthGuard)
  async searchAddedBooks(@Args() args: BookArgs): Promise<BookResponse> {
    const { limit, offset, filter } = args.pagingParams();

    const [books, count] = await this._bookService.getBooksRelay(
      limit,
      offset,
      filter,
    );
    const page = connectionFromArraySlice(books, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }
}

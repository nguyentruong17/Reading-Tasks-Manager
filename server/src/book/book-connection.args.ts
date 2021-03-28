//relay
import { ArgsType, Field } from '@nestjs/graphql';
import ConnectionArgs, {
  FilterableConnection,
} from 'src/graphql/relay/connection.args';
import { BookFilter } from './book.filter';

@ArgsType()
export class BookArgs
  extends ConnectionArgs
  implements FilterableConnection<BookFilter> {
  @Field((types) => BookFilter, {
    nullable: true,
    description: 'Filter books stored in the system',
  })
  filter?: BookFilter;

  pagingParams() {
    const p = super.pagingParams();
    return {
      ...p,
      filter: this.filter,
    };
  }
}

//relay
import { ArgsType, Field } from '@nestjs/graphql';
import ConnectionArgs, {
  FilterableConnection,
} from 'src/graphql/relay/connection.args';
import { UserTaskFilter, UserBookFilter } from './user.filter';

@ArgsType()
export class UserTasksArgs
  extends ConnectionArgs
  implements FilterableConnection<UserTaskFilter> {
  @Field((types) => UserTaskFilter, {
    nullable: true,
    description: "Filter a user's tasks",
  })
  filter?: UserTaskFilter;

  pagingParams() {
    const p = super.pagingParams();
    return {
      ...p,
      filter: this.filter,
    };
  }
}

@ArgsType()
export class UserBooksArgs
  extends ConnectionArgs
  implements FilterableConnection<UserBookFilter> {
  @Field((types) => UserTaskFilter, {
    nullable: true,
    description: "Filter a user's books",
  })
  filter?: UserBookFilter;

  pagingParams() {
    const p = super.pagingParams();
    return {
      ...p,
      filter: this.filter,
    };
  }
}

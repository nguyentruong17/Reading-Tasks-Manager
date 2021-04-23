import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FilterQuery } from 'mongoose';
import { FilterableMongo } from 'src/graphql/relay/connection.args';
import { BookDocument } from './book.model';

@InputType()
export class BookFilter implements FilterableMongo<BookDocument> {
  @Field((types) => GraphQLISODateTime, { nullable: true })
  createdAfter?: Date;
  @Field((types) => GraphQLISODateTime, { nullable: true })
  createdBefore?: Date;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  timesAdded: number;

  createQueries(): FilterQuery<BookDocument> {
    let queries = {} as FilterQuery<BookDocument>;

    if (this.title) {
      queries = {
        ...queries,
        title: {
          $regex: this.title,
          $options: 'i',
        },
      };
    }

    if (this.author) {
      queries = {
        ...queries,
        authors: {
          $elemMatch: { //causes some filtering problems --> find a change
            $regex: this.author,
            $options: 'i',
          },
        },
      };
    }

    if (this.createdAfter) {
      queries = {
        ...queries,
        _id: queries['_id']
          ? {
              ...queries['_id'],
              $gte: this.createdAfter,
            }
          : {
              $gte: this.createdAfter,
            },
      };
    }

    if (this.createdAfter) {
      queries = {
        ...queries,
        _id: queries['_id']
          ? {
              ...queries['_id'],
              $lte: this.createdAfter,
            }
          : {
              $lte: this.createdAfter,
            },
      };
    }

    return queries;
  }
}

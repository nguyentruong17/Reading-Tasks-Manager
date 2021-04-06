import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import relayTypes from 'src/graphql/relay/relay.types';
import { Book, BaseBookIdentifiers } from './book.model';

@ObjectType()
export class BookResponse extends relayTypes<Book>(Book) {}

// @ObjectType()
// export class SubjectsResponse extends relayTypes<Array<string>>(Array) {}

// @ObjectType({
//   description:
//     'A relay-style type for BaseBook. The only difference is in the `subjects` field: [String] -> SubjectsResponse.',
// })
// export class BaseBookRelay extends BaseBookIdentifiers {
//   @Field((types) => [[String]])
//   covers: Array<Array<string>>;

//   @Field((types) => SubjectsResponse)
//   subjects: SubjectsResponse;
// }

// @ObjectType({
//   description:
//     'A relay-style type for BaseBookMongo. The only difference is in the `subjects` field: [String] -> SubjectsResponse.',
// })
// export class BaseBookMongoRelay extends BaseBookRelay {
//   @Field()
//   readonly _id: ObjectId;
// }

// @ObjectType({
//   description:
//     'A relay-style type for Book. The only difference is in the `subjects` field: [String] -> SubjectsResponse.',
// })
// export class BookRelay extends BaseBookMongoRelay {
//   @Field((types) => [ID]) //@Field((type) => [ObjectId]) doesnt work
//   owners: Array<ObjectId>;

//   @Field((types) => Int)
//   timesAdded: number;
// }

// @ObjectType()
// export class BookResponse extends relayTypes<BookRelay>(BookRelay) {}

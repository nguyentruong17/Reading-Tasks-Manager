import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/graphql/relay/relay.types';
import { Book} from './book.model';

@ObjectType()
export class BookResponse extends relayTypes<Book>(Book) { }
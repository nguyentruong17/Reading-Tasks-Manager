import { ObjectType } from '@nestjs/graphql';
import { BaseBookMongo } from 'src/book/book.model';
import relayTypes from 'src/graphql/relay/relay.types';
import { UserTask } from './user.model';

@ObjectType()
export class UserTasksResponse extends relayTypes<UserTask>(UserTask) { }

@ObjectType()
export class UserBooksResponse extends relayTypes<BaseBookMongo>(BaseBookMongo) { }
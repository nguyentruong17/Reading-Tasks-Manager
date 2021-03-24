import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** ObjectId custom scalar type */
  ObjectId: any;
};

export type BaseBook = {
  __typename?: 'BaseBook';
  authors: Array<Scalars['String']>;
  covers: Array<Scalars['String']>;
  openLibraryId: Scalars['String'];
  subjects: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type BaseBookMongo = {
  __typename?: 'BaseBookMongo';
  _id: Scalars['ObjectId'];
  authors: Array<Scalars['String']>;
  covers: Array<Scalars['String']>;
  openLibraryId: Scalars['String'];
  subjects: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type Book = {
  __typename?: 'Book';
  _id: Scalars['ObjectId'];
  authors: Array<Scalars['String']>;
  covers: Array<Scalars['String']>;
  openLibraryId: Scalars['String'];
  owners: Array<Scalars['ID']>;
  subjects: Array<Scalars['String']>;
  timesAdded: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateTaskInput = {
  bookId?: Maybe<Scalars['ObjectId']>;
  description: Scalars['String'];
  openLibraryBookId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};


export type Mutation = {
  __typename?: 'Mutation';
  createTask: Task;
  deleteTask: Scalars['ObjectId'];
  login: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteTaskArgs = {
  taskId: Scalars['ObjectId'];
};


export type MutationLoginArgs = {
  idToken: Scalars['String'];
};


export type Query = {
  __typename?: 'Query';
  getAllBooks: Array<Book>;
  searchOnlineBooks: Array<BaseBook>;
};


export type QuerySearchOnlineBooksArgs = {
  input: SearchBookInput;
};

export type SearchBookInput = {
  author?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Task = {
  __typename?: 'Task';
  _id: Scalars['ObjectId'];
  attachItem: BaseBookMongo;
  description: Scalars['String'];
  history: Array<TaskHistory>;
  owner: Scalars['ObjectId'];
  status: Scalars['String'];
  title: Scalars['String'];
};

export type TaskHistory = {
  __typename?: 'TaskHistory';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  idToken: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);


export const LoginDocument = gql`
    mutation login($idToken: String!) {
  login(idToken: $idToken)
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoginMutation> {
      return withWrapper(() => client.request<LoginMutation>(LoginDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
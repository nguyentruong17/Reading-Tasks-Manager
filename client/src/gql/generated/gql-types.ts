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
  GraphQLObjectId: any;
};

export type BaseBook = {
  __typename?: 'BaseBook';
  authors: Array<Scalars['String']>;
  covers: Array<Array<Scalars['String']>>;
  openLibraryId: Scalars['String'];
  subjects: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type BaseBookIdentifiers = {
  __typename?: 'BaseBookIdentifiers';
  authors: Array<Scalars['String']>;
  openLibraryId: Scalars['String'];
  title: Scalars['String'];
};

export type BaseBookMongo = {
  __typename?: 'BaseBookMongo';
  _id: Scalars['GraphQLObjectId'];
  authors: Array<Scalars['String']>;
  covers: Array<Array<Scalars['String']>>;
  openLibraryId: Scalars['String'];
  subjects: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type BaseBookMongoConnection = {
  __typename?: 'BaseBookMongoConnection';
  edges?: Maybe<Array<BaseBookMongoEdge>>;
  pageInfo?: Maybe<BaseBookMongoPageInfo>;
};

export type BaseBookMongoEdge = {
  __typename?: 'BaseBookMongoEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<BaseBookMongo>;
};

export type BaseBookMongoPageInfo = {
  __typename?: 'BaseBookMongoPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Book = {
  __typename?: 'Book';
  _id: Scalars['GraphQLObjectId'];
  authors: Array<Scalars['String']>;
  covers: Array<Array<Scalars['String']>>;
  openLibraryId: Scalars['String'];
  owners: Array<Scalars['ID']>;
  subjects: Array<Scalars['String']>;
  timesAdded: Scalars['Int'];
  title: Scalars['String'];
};

export type BookConnection = {
  __typename?: 'BookConnection';
  edges?: Maybe<Array<BookEdge>>;
  pageInfo?: Maybe<BookPageInfo>;
};

export type BookEdge = {
  __typename?: 'BookEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Book>;
};

export type BookFilter = {
  author?: Maybe<Scalars['String']>;
  createdAfter?: Maybe<Scalars['DateTime']>;
  createdBefore?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
};

export type BookPageInfo = {
  __typename?: 'BookPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type BookResponse = {
  __typename?: 'BookResponse';
  page: BookConnection;
  pageData?: Maybe<PageData>;
};

export type CreateTaskHistoryInput = {
  description: Scalars['String'];
  title: Scalars['String'];
};

export type CreateTaskInput = {
  bookId?: Maybe<Scalars['GraphQLObjectId']>;
  description: Scalars['String'];
  openLibraryBookId?: Maybe<Scalars['String']>;
  priority?: Maybe<TaskPriority>;
  title: Scalars['String'];
};



export type Mutation = {
  __typename?: 'Mutation';
  addTaskHistory: TaskHistory;
  createTask: Task;
  deleteTask: Scalars['GraphQLObjectId'];
  login: Scalars['String'];
  updateTask: Task;
  updateTaskHistory: TaskHistory;
};


export type MutationAddTaskHistoryArgs = {
  input: CreateTaskHistoryInput;
  taskId: Scalars['GraphQLObjectId'];
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteTaskArgs = {
  taskId: Scalars['GraphQLObjectId'];
};


export type MutationLoginArgs = {
  idToken: Scalars['String'];
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
  taskId: Scalars['GraphQLObjectId'];
};


export type MutationUpdateTaskHistoryArgs = {
  input: UpdateTaskHistoryInput;
  taskHistoryId: Scalars['GraphQLObjectId'];
  taskId: Scalars['GraphQLObjectId'];
};

export type PageData = {
  __typename?: 'PageData';
  count: Scalars['Int'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getAllBooks: BookResponse;
  getBooks: UserBooksResponse;
  getTask: Task;
  getTasks: UserTasksResponse;
  searchOnlineBooks: Array<BaseBook>;
};


export type QueryGetAllBooksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<BookFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetBooksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<UserTaskFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetTaskArgs = {
  taskId: Scalars['GraphQLObjectId'];
};


export type QueryGetTasksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<UserTaskFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuerySearchOnlineBooksArgs = {
  input: SearchBookInput;
  limit?: Maybe<Scalars['Float']>;
  offset?: Maybe<Scalars['Float']>;
};

export type SearchBookInput = {
  author?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Task = {
  __typename?: 'Task';
  _id: Scalars['GraphQLObjectId'];
  attachItem: BaseBookMongo;
  description: Scalars['String'];
  history: TaskHistoryResponse;
  owner: Scalars['GraphQLObjectId'];
  priority: TaskPriority;
  status: TaskStatus;
  title: Scalars['String'];
};


export type TaskHistoryArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type TaskHistory = {
  __typename?: 'TaskHistory';
  _id: Scalars['GraphQLObjectId'];
  autoGenerated: Scalars['Boolean'];
  description: Scalars['String'];
  taskId: Scalars['GraphQLObjectId'];
  taskStatus: TaskStatus;
  title: Scalars['String'];
};

export type TaskHistoryConnection = {
  __typename?: 'TaskHistoryConnection';
  edges?: Maybe<Array<TaskHistoryEdge>>;
  pageInfo?: Maybe<TaskHistoryPageInfo>;
};

export type TaskHistoryEdge = {
  __typename?: 'TaskHistoryEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<TaskHistory>;
};

export type TaskHistoryPageInfo = {
  __typename?: 'TaskHistoryPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type TaskHistoryResponse = {
  __typename?: 'TaskHistoryResponse';
  page: TaskHistoryConnection;
  pageData?: Maybe<PageData>;
};

export enum TaskPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  /** The default status. */
  None = 'NONE'
}

export enum TaskStatus {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  /** The default status. */
  New = 'NEW',
  Postpone = 'POSTPONE'
}

export type UpdateTaskHistoryInput = {
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateTaskInput = {
  bookId?: Maybe<Scalars['GraphQLObjectId']>;
  description?: Maybe<Scalars['String']>;
  openLibraryBookId?: Maybe<Scalars['String']>;
  priority?: Maybe<TaskPriority>;
  status?: Maybe<TaskStatus>;
  title?: Maybe<Scalars['String']>;
};

export type UserBooksResponse = {
  __typename?: 'UserBooksResponse';
  page: BaseBookMongoConnection;
  pageData?: Maybe<PageData>;
};

export type UserTask = {
  __typename?: 'UserTask';
  _id: Scalars['GraphQLObjectId'];
  attachItem: BaseBookIdentifiers;
  description: Scalars['String'];
  priority: TaskPriority;
  status: TaskStatus;
  title: Scalars['String'];
};

export type UserTaskAttachItemFilter = {
  openLibraryBookId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type UserTaskConnection = {
  __typename?: 'UserTaskConnection';
  edges?: Maybe<Array<UserTaskEdge>>;
  pageInfo?: Maybe<UserTaskPageInfo>;
};

export type UserTaskEdge = {
  __typename?: 'UserTaskEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<UserTask>;
};

export type UserTaskFilter = {
  attachItem?: Maybe<UserTaskAttachItemFilter>;
  from?: Maybe<Scalars['DateTime']>;
  priority?: Maybe<TaskPriority>;
  status?: Maybe<TaskStatus>;
  title?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['DateTime']>;
};

export type UserTaskPageInfo = {
  __typename?: 'UserTaskPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type UserTasksResponse = {
  __typename?: 'UserTasksResponse';
  page: UserTaskConnection;
  pageData?: Maybe<PageData>;
};

export type LoginMutationVariables = Exact<{
  idToken: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type ViewTask_AttachItem_Title_Fragment = (
  { __typename?: 'BaseBookIdentifiers' }
  & Pick<BaseBookIdentifiers, 'title'>
);

export type ViewTasks_UserTask_All_Fragment = (
  { __typename?: 'UserTask' }
  & Pick<UserTask, '_id' | 'title' | 'status' | 'priority' | 'description'>
  & { attachItem: (
    { __typename?: 'BaseBookIdentifiers' }
    & ViewTask_AttachItem_Title_Fragment
  ) }
);

export type GetTasksQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<UserTaskFilter>;
}>;


export type GetTasksQuery = (
  { __typename?: 'Query' }
  & { getTasks: (
    { __typename?: 'UserTasksResponse' }
    & { page: (
      { __typename?: 'UserTaskConnection' }
      & { edges?: Maybe<Array<(
        { __typename?: 'UserTaskEdge' }
        & Pick<UserTaskEdge, 'cursor'>
        & { node?: Maybe<(
          { __typename?: 'UserTask' }
          & ViewTasks_UserTask_All_Fragment
        )> }
      )>>, pageInfo?: Maybe<(
        { __typename?: 'UserTaskPageInfo' }
        & Pick<UserTaskPageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
      )> }
    ), pageData?: Maybe<(
      { __typename?: 'PageData' }
      & Pick<PageData, 'count' | 'limit' | 'offset'>
    )> }
  ) }
);

export const ViewTask_AttachItem_Title_FragmentDoc = gql`
    fragment ViewTask_AttachItem_Title_ on BaseBookIdentifiers {
  title
}
    `;
export const ViewTasks_UserTask_All_FragmentDoc = gql`
    fragment ViewTasks_UserTask_All_ on UserTask {
  _id
  title
  status
  priority
  description
  attachItem {
    ...ViewTask_AttachItem_Title_
  }
}
    ${ViewTask_AttachItem_Title_FragmentDoc}`;
export const LoginDocument = gql`
    mutation login($idToken: String!) {
  login(idToken: $idToken)
}
    `;
export const GetTasksDocument = gql`
    query getTasks($first: Int, $after: String, $last: Int, $before: String, $filter: UserTaskFilter) {
  getTasks(
    first: $first
    after: $after
    last: $last
    before: $before
    filter: $filter
  ) {
    page {
      edges {
        cursor
        node {
          ...ViewTasks_UserTask_All_
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
    pageData {
      count
      limit
      offset
    }
  }
}
    ${ViewTasks_UserTask_All_FragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoginMutation> {
      return withWrapper(() => client.request<LoginMutation>(LoginDocument, variables, requestHeaders));
    },
    getTasks(variables?: GetTasksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTasksQuery> {
      return withWrapper(() => client.request<GetTasksQuery>(GetTasksDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
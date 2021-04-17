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
  covers: Array<Maybe<Array<Maybe<Scalars['String']>>>>;
  openLibraryId: Scalars['String'];
  subjects: Array<Maybe<Scalars['String']>>;
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
  covers: Array<Maybe<Array<Maybe<Scalars['String']>>>>;
  openLibraryId: Scalars['String'];
  subjects: Array<Maybe<Scalars['String']>>;
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
  covers: Array<Maybe<Array<Maybe<Scalars['String']>>>>;
  openLibraryId: Scalars['String'];
  owners: Array<Scalars['ID']>;
  subjects: Array<Maybe<Scalars['String']>>;
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
  getBooks: UserBooksResponse;
  getTask: Task;
  getTasks: UserTasksResponse;
  searchAddedBooks: BookResponse;
  searchOnlineBooks: Array<BaseBook>;
};


export type QueryGetBooksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<UserBookFilter>;
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


export type QuerySearchAddedBooksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filter?: Maybe<BookFilter>;
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
};

export type UpdateTaskInput = {
  bookId?: Maybe<Scalars['GraphQLObjectId']>;
  description?: Maybe<Scalars['String']>;
  openLibraryBookId?: Maybe<Scalars['String']>;
  priority?: Maybe<TaskPriority>;
  status?: Maybe<TaskStatus>;
  title?: Maybe<Scalars['String']>;
};

export type UserBookFilter = {
  author?: Maybe<Scalars['String']>;
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

export type Search_BaseBook_All_Fragment = (
  { __typename?: 'BaseBook' }
  & Pick<BaseBook, 'openLibraryId' | 'title' | 'authors' | 'covers' | 'subjects'>
);

export type Search_Book_Parts_Fragment = (
  { __typename?: 'Book' }
  & Pick<Book, 'openLibraryId' | 'title' | 'authors' | 'covers' | 'subjects' | '_id' | 'timesAdded'>
);

export type SearchOnlineBooksQueryVariables = Exact<{
  input: SearchBookInput;
  limit?: Maybe<Scalars['Float']>;
  offset?: Maybe<Scalars['Float']>;
}>;


export type SearchOnlineBooksQuery = (
  { __typename?: 'Query' }
  & { searchOnlineBooks: Array<(
    { __typename?: 'BaseBook' }
    & Search_BaseBook_All_Fragment
  )> }
);

export type SearchAddedBooksQueryVariables = Exact<{
  filter?: Maybe<BookFilter>;
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
}>;


export type SearchAddedBooksQuery = (
  { __typename?: 'Query' }
  & { searchAddedBooks: (
    { __typename?: 'BookResponse' }
    & { page: (
      { __typename?: 'BookConnection' }
      & { edges?: Maybe<Array<(
        { __typename?: 'BookEdge' }
        & Pick<BookEdge, 'cursor'>
        & { node?: Maybe<(
          { __typename?: 'Book' }
          & Search_Book_Parts_Fragment
        )> }
      )>>, pageInfo?: Maybe<(
        { __typename?: 'BookPageInfo' }
        & Pick<BookPageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
      )> }
    ), pageData?: Maybe<(
      { __typename?: 'PageData' }
      & Pick<PageData, 'count' | 'limit' | 'offset'>
    )> }
  ) }
);

export type ViewTask_AttachItem_Parts_Fragment = (
  { __typename?: 'BaseBookMongo' }
  & Pick<BaseBookMongo, 'title' | 'authors' | 'covers' | 'subjects'>
);

export type ViewTask_Task_Parts_Fragment = (
  { __typename?: 'Task' }
  & Pick<Task, '_id' | 'title' | 'status' | 'priority' | 'description'>
);

export type ViewTask_TaskHistory_All_Fragment = (
  { __typename?: 'TaskHistory' }
  & Pick<TaskHistory, '_id' | 'taskId' | 'taskStatus' | 'autoGenerated' | 'description'>
);

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
  taskId: Scalars['GraphQLObjectId'];
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'Task' }
    & ViewTask_Task_Parts_Fragment
  ) }
);

export type ChangeAttachItemMutationVariables = Exact<{
  input: UpdateTaskInput;
  taskId: Scalars['GraphQLObjectId'];
}>;


export type ChangeAttachItemMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'Task' }
    & { attachItem: (
      { __typename?: 'BaseBookMongo' }
      & ViewTask_AttachItem_Parts_Fragment
    ) }
  ) }
);

export type UpdateTaskAndChangeAttachItemMutationVariables = Exact<{
  input: UpdateTaskInput;
  taskId: Scalars['GraphQLObjectId'];
}>;


export type UpdateTaskAndChangeAttachItemMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'Task' }
    & { attachItem: (
      { __typename?: 'BaseBookMongo' }
      & ViewTask_AttachItem_Parts_Fragment
    ) }
    & ViewTask_Task_Parts_Fragment
  ) }
);

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'Task' }
    & { attachItem: (
      { __typename?: 'BaseBookMongo' }
      & ViewTask_AttachItem_Parts_Fragment
    ), history: (
      { __typename?: 'TaskHistoryResponse' }
      & { page: (
        { __typename?: 'TaskHistoryConnection' }
        & { edges?: Maybe<Array<(
          { __typename?: 'TaskHistoryEdge' }
          & Pick<TaskHistoryEdge, 'cursor'>
          & { node?: Maybe<(
            { __typename?: 'TaskHistory' }
            & ViewTask_TaskHistory_All_Fragment
          )> }
        )>>, pageInfo?: Maybe<(
          { __typename?: 'TaskHistoryPageInfo' }
          & Pick<TaskHistoryPageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
        )> }
      ), pageData?: Maybe<(
        { __typename?: 'PageData' }
        & Pick<PageData, 'count' | 'limit' | 'offset'>
      )> }
    ) }
    & ViewTask_Task_Parts_Fragment
  ) }
);

export type GetTaskQueryVariables = Exact<{
  taskId: Scalars['GraphQLObjectId'];
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
}>;


export type GetTaskQuery = (
  { __typename?: 'Query' }
  & { getTask: (
    { __typename?: 'Task' }
    & { attachItem: (
      { __typename?: 'BaseBookMongo' }
      & ViewTask_AttachItem_Parts_Fragment
    ), history: (
      { __typename?: 'TaskHistoryResponse' }
      & { page: (
        { __typename?: 'TaskHistoryConnection' }
        & { edges?: Maybe<Array<(
          { __typename?: 'TaskHistoryEdge' }
          & Pick<TaskHistoryEdge, 'cursor'>
          & { node?: Maybe<(
            { __typename?: 'TaskHistory' }
            & ViewTask_TaskHistory_All_Fragment
          )> }
        )>>, pageInfo?: Maybe<(
          { __typename?: 'TaskHistoryPageInfo' }
          & Pick<TaskHistoryPageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
        )> }
      ), pageData?: Maybe<(
        { __typename?: 'PageData' }
        & Pick<PageData, 'count' | 'limit' | 'offset'>
      )> }
    ) }
    & ViewTask_Task_Parts_Fragment
  ) }
);

export type GetTaskHistoryQueryVariables = Exact<{
  taskId: Scalars['GraphQLObjectId'];
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
}>;


export type GetTaskHistoryQuery = (
  { __typename?: 'Query' }
  & { getTask: (
    { __typename?: 'Task' }
    & { history: (
      { __typename?: 'TaskHistoryResponse' }
      & { page: (
        { __typename?: 'TaskHistoryConnection' }
        & { edges?: Maybe<Array<(
          { __typename?: 'TaskHistoryEdge' }
          & Pick<TaskHistoryEdge, 'cursor'>
          & { node?: Maybe<(
            { __typename?: 'TaskHistory' }
            & ViewTask_TaskHistory_All_Fragment
          )> }
        )>>, pageInfo?: Maybe<(
          { __typename?: 'TaskHistoryPageInfo' }
          & Pick<TaskHistoryPageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
        )> }
      ), pageData?: Maybe<(
        { __typename?: 'PageData' }
        & Pick<PageData, 'count' | 'limit' | 'offset'>
      )> }
    ) }
  ) }
);

export type ViewTasks_AttachItem_Title_Fragment = (
  { __typename?: 'BaseBookIdentifiers' }
  & Pick<BaseBookIdentifiers, 'title'>
);

export type ViewTasks_UserTask_All_Fragment = (
  { __typename?: 'UserTask' }
  & Pick<UserTask, '_id' | 'title' | 'status' | 'priority' | 'description'>
  & { attachItem: (
    { __typename?: 'BaseBookIdentifiers' }
    & ViewTasks_AttachItem_Title_Fragment
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

export const Search_BaseBook_All_FragmentDoc = gql`
    fragment Search_BaseBook_All_ on BaseBook {
  openLibraryId
  title
  authors
  covers
  subjects
}
    `;
export const Search_Book_Parts_FragmentDoc = gql`
    fragment Search_Book_Parts_ on Book {
  openLibraryId
  title
  authors
  covers
  subjects
  _id
  timesAdded
}
    `;
export const ViewTask_AttachItem_Parts_FragmentDoc = gql`
    fragment ViewTask_AttachItem_Parts_ on BaseBookMongo {
  title
  authors
  covers
  subjects
}
    `;
export const ViewTask_Task_Parts_FragmentDoc = gql`
    fragment ViewTask_Task_Parts_ on Task {
  _id
  title
  status
  priority
  description
}
    `;
export const ViewTask_TaskHistory_All_FragmentDoc = gql`
    fragment ViewTask_TaskHistory_All_ on TaskHistory {
  _id
  taskId
  taskStatus
  autoGenerated
  description
}
    `;
export const ViewTasks_AttachItem_Title_FragmentDoc = gql`
    fragment ViewTasks_AttachItem_Title_ on BaseBookIdentifiers {
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
    ...ViewTasks_AttachItem_Title_
  }
}
    ${ViewTasks_AttachItem_Title_FragmentDoc}`;
export const LoginDocument = gql`
    mutation login($idToken: String!) {
  login(idToken: $idToken)
}
    `;
export const SearchOnlineBooksDocument = gql`
    query searchOnlineBooks($input: SearchBookInput!, $limit: Float, $offset: Float) {
  searchOnlineBooks(input: $input, limit: $limit, offset: $offset) {
    ...Search_BaseBook_All_
  }
}
    ${Search_BaseBook_All_FragmentDoc}`;
export const SearchAddedBooksDocument = gql`
    query searchAddedBooks($filter: BookFilter, $first: Int, $after: String, $last: Int, $before: String) {
  searchAddedBooks(
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
          ...Search_Book_Parts_
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
    ${Search_Book_Parts_FragmentDoc}`;
export const UpdateTaskDocument = gql`
    mutation updateTask($input: UpdateTaskInput!, $taskId: GraphQLObjectId!) {
  updateTask(input: $input, taskId: $taskId) {
    ...ViewTask_Task_Parts_
  }
}
    ${ViewTask_Task_Parts_FragmentDoc}`;
export const ChangeAttachItemDocument = gql`
    mutation changeAttachItem($input: UpdateTaskInput!, $taskId: GraphQLObjectId!) {
  updateTask(input: $input, taskId: $taskId) {
    attachItem {
      ...ViewTask_AttachItem_Parts_
    }
  }
}
    ${ViewTask_AttachItem_Parts_FragmentDoc}`;
export const UpdateTaskAndChangeAttachItemDocument = gql`
    mutation updateTaskAndChangeAttachItem($input: UpdateTaskInput!, $taskId: GraphQLObjectId!) {
  updateTask(input: $input, taskId: $taskId) {
    ...ViewTask_Task_Parts_
    attachItem {
      ...ViewTask_AttachItem_Parts_
    }
  }
}
    ${ViewTask_Task_Parts_FragmentDoc}
${ViewTask_AttachItem_Parts_FragmentDoc}`;
export const CreateTaskDocument = gql`
    mutation createTask($input: CreateTaskInput!, $first: Int, $after: String, $last: Int, $before: String) {
  createTask(input: $input) {
    ...ViewTask_Task_Parts_
    attachItem {
      ...ViewTask_AttachItem_Parts_
    }
    history(first: $first, after: $after, last: $last, before: $before) {
      page {
        edges {
          cursor
          node {
            ...ViewTask_TaskHistory_All_
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
}
    ${ViewTask_Task_Parts_FragmentDoc}
${ViewTask_AttachItem_Parts_FragmentDoc}
${ViewTask_TaskHistory_All_FragmentDoc}`;
export const GetTaskDocument = gql`
    query getTask($taskId: GraphQLObjectId!, $first: Int, $after: String, $last: Int, $before: String) {
  getTask(taskId: $taskId) {
    ...ViewTask_Task_Parts_
    attachItem {
      ...ViewTask_AttachItem_Parts_
    }
    history(first: $first, after: $after, last: $last, before: $before) {
      page {
        edges {
          cursor
          node {
            ...ViewTask_TaskHistory_All_
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
}
    ${ViewTask_Task_Parts_FragmentDoc}
${ViewTask_AttachItem_Parts_FragmentDoc}
${ViewTask_TaskHistory_All_FragmentDoc}`;
export const GetTaskHistoryDocument = gql`
    query getTaskHistory($taskId: GraphQLObjectId!, $first: Int, $after: String, $last: Int, $before: String) {
  getTask(taskId: $taskId) {
    history(first: $first, after: $after, last: $last, before: $before) {
      page {
        edges {
          cursor
          node {
            ...ViewTask_TaskHistory_All_
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
}
    ${ViewTask_TaskHistory_All_FragmentDoc}`;
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
    searchOnlineBooks(variables: SearchOnlineBooksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchOnlineBooksQuery> {
      return withWrapper(() => client.request<SearchOnlineBooksQuery>(SearchOnlineBooksDocument, variables, requestHeaders));
    },
    searchAddedBooks(variables?: SearchAddedBooksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchAddedBooksQuery> {
      return withWrapper(() => client.request<SearchAddedBooksQuery>(SearchAddedBooksDocument, variables, requestHeaders));
    },
    updateTask(variables: UpdateTaskMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateTaskMutation> {
      return withWrapper(() => client.request<UpdateTaskMutation>(UpdateTaskDocument, variables, requestHeaders));
    },
    changeAttachItem(variables: ChangeAttachItemMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ChangeAttachItemMutation> {
      return withWrapper(() => client.request<ChangeAttachItemMutation>(ChangeAttachItemDocument, variables, requestHeaders));
    },
    updateTaskAndChangeAttachItem(variables: UpdateTaskAndChangeAttachItemMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateTaskAndChangeAttachItemMutation> {
      return withWrapper(() => client.request<UpdateTaskAndChangeAttachItemMutation>(UpdateTaskAndChangeAttachItemDocument, variables, requestHeaders));
    },
    createTask(variables: CreateTaskMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateTaskMutation> {
      return withWrapper(() => client.request<CreateTaskMutation>(CreateTaskDocument, variables, requestHeaders));
    },
    getTask(variables: GetTaskQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTaskQuery> {
      return withWrapper(() => client.request<GetTaskQuery>(GetTaskDocument, variables, requestHeaders));
    },
    getTaskHistory(variables: GetTaskHistoryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTaskHistoryQuery> {
      return withWrapper(() => client.request<GetTaskHistoryQuery>(GetTaskHistoryDocument, variables, requestHeaders));
    },
    getTasks(variables?: GetTasksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTasksQuery> {
      return withWrapper(() => client.request<GetTasksQuery>(GetTasksDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
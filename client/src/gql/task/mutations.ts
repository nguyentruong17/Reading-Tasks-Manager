import gql from "graphql-tag";

export const updateTask = gql`
  mutation updateTask($input: UpdateTaskInput!, $taskId: GraphQLObjectId!) {
    updateTask(input: $input, taskId: $taskId) {
      ...ViewTask_Task_Parts_
    }
  }
`;

export const changeAttachItem = gql`
  mutation changeAttachItem(
    $input: UpdateTaskInput!
    $taskId: GraphQLObjectId!
  ) {
    updateTask(input: $input, taskId: $taskId) {
      attachItem {
        ...ViewTask_AttachItem_Parts_
      }
    }
  }
`;

export const updateTaskAndChangeAttachItem = gql`
  mutation updateTaskAndChangeAttachItem(
    $input: UpdateTaskInput!
    $taskId: GraphQLObjectId!
  ) {
    updateTask(input: $input, taskId: $taskId) {
      ...ViewTask_Task_Parts_
      attachItem {
        ...ViewTask_AttachItem_Parts_
      }
    }
  }
`;

export const createTask = gql`
  mutation createTask(
    $input: CreateTaskInput!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
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
`;

export const deleteTask = gql`
  mutation deleteTask($taskId: GraphQLObjectId!) {
    deleteTask(taskId: $taskId)
  }
`;

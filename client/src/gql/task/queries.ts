import gql from "graphql-tag";

export const getTaskForViewTask = gql`
  query getTask(
    $taskId: GraphQLObjectId!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
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
`;

export const getTaskHistoryForViewTask = gql`
  query getTaskHistory(
    $taskId: GraphQLObjectId!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
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
`;

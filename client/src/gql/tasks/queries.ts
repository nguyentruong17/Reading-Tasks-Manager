import gql from "graphql-tag";

export const getTasksForViewTasks = gql`
  query getTasks(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: UserTaskFilter
  ) {
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
`;
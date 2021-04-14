import gql from "graphql-tag";

export const searchOnlineBooks = gql`
  query searchOnlineBooks(
    $input: SearchBookInput!
    $limit: Float
    $offset: Float
  ) {
    searchOnlineBooks(input: $input, limit: $limit, offset: $offset) {
      ...Search_BaseBook_All_
    }
  }
`;

export const searchAddedBooks = gql`
  query searchAddedBooks(
    $filter: BookFilter
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
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
`;

import gql from "graphql-tag";
export const getBooksForViewBooks = gql`
  query getBooks(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: UserBookFilter
  ) {
    getBooks(
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
            ...ViewBooks_BaseBookMongo_Parts_
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

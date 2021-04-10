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

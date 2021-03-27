import gql from "graphql-tag";

export const getTasks = gql`
  query getTasks {
    getTasks {
      _id
      title
      status
      description
    }
  }
`;

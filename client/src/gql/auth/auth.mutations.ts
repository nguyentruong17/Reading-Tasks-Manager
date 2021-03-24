import gql from "graphql-tag";

export const login = gql`
  mutation login($idToken: String!) {
    login(idToken: $idToken)
  }
`;

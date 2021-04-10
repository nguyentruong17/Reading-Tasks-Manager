import gql from "graphql-tag";

export const BaseBookFragment = gql`
  fragment Search_BaseBook_All_ on BaseBook {
    openLibraryId,
    title,
    authors,
    covers,
    subjects
  }
`;

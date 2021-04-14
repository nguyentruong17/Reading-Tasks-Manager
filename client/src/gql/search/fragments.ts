import gql from "graphql-tag";

export const BaseBookFragment = gql`
  fragment Search_BaseBook_All_ on BaseBook {
    openLibraryId
    title
    authors
    covers
    subjects
  }
`;

export const BookFragment = gql`
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

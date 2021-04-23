import gql from "graphql-tag";

export const BaseBookMongoFragment = gql`
  fragment ViewBooks_BaseBookMongo_Parts_ on BaseBookMongo {
    openLibraryId
    title
    authors
    covers
    subjects
    _id
  }
`;

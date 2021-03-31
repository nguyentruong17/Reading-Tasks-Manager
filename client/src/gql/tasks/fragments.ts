import gql from "graphql-tag";

export const AttachItemFragment = gql`
  fragment ViewTask_AttachItem_Title_ on BaseBookIdentifiers {
    title
  }
`;

export const UserTaskFragment = gql`
  fragment ViewTasks_UserTask_All_ on UserTask {
    _id
    title
    status
    priority
    description
    attachItem {
      ...ViewTask_AttachItem_Title_
    }
  }
`;

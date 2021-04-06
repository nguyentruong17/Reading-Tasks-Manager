import gql from "graphql-tag";

export const AttachItemFragment = gql`
  fragment ViewTasks_AttachItem_Title_ on BaseBookIdentifiers {
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
      ...ViewTasks_AttachItem_Title_
    }
  }
`;

import gql from "graphql-tag";

export const AttachItemFragment = gql`
  fragment ViewTask_AttachItem_Parts_ on BaseBookMongo {
    title
    authors
    covers
    subjects
  }
`;

export const TaskFragment = gql`
  fragment ViewTask_Task_Parts_ on Task {
    _id
    title
    status
    priority
    description
    attachItem {
      ...ViewTask_AttachItem_Parts_
    }
  }
`;

export const TaskHistoryFragment = gql`
  fragment ViewTask_TaskHistory_All_ on TaskHistory {
    _id
    taskId
    taskStatus
    autoGenerated
    title
    description
  }
`;
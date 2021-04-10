import gql from "graphql-tag";

export const updateTask = gql`
  mutation updateTask($input: UpdateTaskInput!, $taskId: GraphQLObjectId!) {
    updateTask(input: $input, taskId: $taskId) {
      ...ViewTask_Task_Parts_
    }
  }
`;

export const changeAttachItem = gql`
  mutation changeAttachItem(
    $input: UpdateTaskInput!
    $taskId: GraphQLObjectId!
  ) {
    updateTask(input: $input, taskId: $taskId) {
      attachItem {
        ...ViewTask_AttachItem_Parts_
      }
    }
  }
`;

export const updateTaskAndChangeAttachItem = gql`
  mutation updateTaskAndChangeAttachItem(
    $input: UpdateTaskInput!
    $taskId: GraphQLObjectId!
  ) {
    updateTask(input: $input, taskId: $taskId) {
      ...ViewTask_Task_Parts_
      attachItem {
        ...ViewTask_AttachItem_Parts_
      }
    }
  }
`;

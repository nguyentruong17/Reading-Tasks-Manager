import gql from "graphql-tag";

export const updateTask = gql`
  mutation updateTask($input: UpdateTaskInput!, $taskId: GraphQLObjectId!) {
    updateTask(input: $input, taskId: $taskId) {
      ...ViewTask_Task_Parts_
    }
  }
`;

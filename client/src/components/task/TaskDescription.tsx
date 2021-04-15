import React, { FC } from "react";
//redux
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import {
  //
  OperationState,
  //selectors
  selectOperation,
} from "features/task/crudTaskSlice";
//uis
import { Box, BoxProps, Text, Textarea } from "@chakra-ui/react";
import CustomTextareaControl from "components/common/CustomTextareaControl";

export interface ITaskDescriptionProps extends BoxProps {
  name: string;
}
const TaskDescription: FC<ITaskDescriptionProps> = ({ name }) => {
  //crudTask
  const operation = useSelector(selectOperation);

  //task
  const task = useSelector(selectTask);
  return (
    <Box>
      {(operation === OperationState.Create ||
        operation === OperationState.Update) && (
        <>
          <CustomTextareaControl
            name={name}
            label={"Description: "}
            placeholder={"My Task's Description..."}
          />
        </>
      )}
      {operation !== OperationState.Create &&
        operation !== OperationState.Update &&
        task && (
          <>
            <Text fontSize={["xs", "sm"]} fontWeight="bold">
              Description:{" "}
            </Text>
            <Textarea fontSize={["xs", "sm", "lg"]} isReadOnly={true} value={task.description} />
          </>
        )}
    </Box>
  );
};

export default TaskDescription;

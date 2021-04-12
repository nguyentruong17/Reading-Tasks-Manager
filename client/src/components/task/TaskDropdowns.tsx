import React, { FC } from "react";
//redux
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import {
  //
  OperationState,
  //selectors
  selectOperation,
  selectCurrentTaskId,
} from "features/task/crudTaskSlice";
//uis
import { Container, Box, BoxProps, Text, Badge, Flex } from "@chakra-ui/react";
import CustomSelectControl from "components/common/CustomSelectControl";
import { Priorities, Status } from "consts";

export interface TaskDropdownsProps extends BoxProps {
  statusSelectName: string;
  prioritySelectName: string;
}
const TaskDropdowns: FC<TaskDropdownsProps> = ({
  statusSelectName,
  prioritySelectName,
  ...rest
}) => {
  //crudTask
  const operation = useSelector(selectOperation);

  //task
  const task = useSelector(selectTask);
  return (
    <Box {...rest}>
      {(operation === OperationState.Create ||
        operation === OperationState.Update) && (
        <Flex direction="row">
          <CustomSelectControl
            name={statusSelectName}
            label={"Status: "}
            options={Object.values(Status)}
            isDisabled={operation === OperationState.Create}
          />
          <CustomSelectControl
            name={prioritySelectName}
            label={"Priority: "}
            options={Object.values(Priorities)}
          />
        </Flex>
      )}
      {operation !== OperationState.Create &&
        operation !== OperationState.Update &&
        task && (
          <Flex direction="row">
            <Container pl={0}>
              <Text fontSize={["xs", "sm"]} color="gray.500">
                Status:
              </Text>
              <Text>{Status[task.status].name}</Text>
            </Container>
            <Container pl={0}>
              <Text fontSize={["xs", "sm"]} color="gray.500">
                Priority:
              </Text>
              <Badge
                colorScheme={Priorities[task.priority].color}
                px={[3, 3, 6]}
              >
                {task.priority}
              </Badge>
            </Container>
          </Flex>
        )}
    </Box>
  );
};

export default TaskDropdowns;

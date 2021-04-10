import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import { Container, Box, BoxProps, Text, Badge, Flex } from "@chakra-ui/react";
import CustomSelectControl from "components/common/CustomSelectControl";
import { Priorities, Status } from "consts";

export interface TaskDropdownsProps extends BoxProps {
  id?: string;
  editMode: boolean;
  statusSelectName: string;
  prioritySelectName: string;
}
const TaskDropdowns: FC<TaskDropdownsProps> = ({
  id,
  editMode,
  statusSelectName,
  prioritySelectName,
  ...rest
}) => {
  const task = useSelector(selectTask);
  return (
    <Box {...rest}>
      {(!id || (id && editMode)) && (
        <Flex direction="row">
          <CustomSelectControl
            name={statusSelectName}
            label={"Status: "}
            options={Object.values(Status)}
            isDisabled={id ? false : true}
          />
          <CustomSelectControl
            name={prioritySelectName}
            label={"Priority: "}
            options={Object.values(Priorities)}
          />
        </Flex>
      )}
      {id && task && !editMode && (
        <Flex direction="row">
          <Container pl={0}>
            <Text fontSize={["xs", "sm"]} color="gray.500">
              Status:
            </Text>
            <Text>{ Status[task.status].name }</Text>
          </Container>
          <Container pl={0}>
            <Text fontSize={["xs", "sm"]} color="gray.500">
              Priority:
            </Text>
            <Badge
              colorScheme={Priorities[task.priority].color}
              px={[3, 3, 6]}
            >{task.priority}</Badge>
          </Container>
        </Flex>
      )}
    </Box>
  );
};

export default TaskDropdowns;

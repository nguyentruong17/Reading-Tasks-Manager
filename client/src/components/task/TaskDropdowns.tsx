import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import { Container, Text, Badge } from "@chakra-ui/react";
import CustomSelectControl from "components/common/CustomSelectControl";
import { Priorities, Status } from "consts";

export interface TaskDropdownsProps {
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
}) => {
  const task = useSelector(selectTask);
  return (
    <Container>
      {(!id || (id && editMode)) && (
        <>
          <CustomSelectControl
            name={prioritySelectName}
            label={"Priority: "}
            options={Object.values(Priorities)}
          />
          <CustomSelectControl
            name={statusSelectName}
            label={"Status: "}
            options={Object.values(Status)}
            isDisabled={id ? false : true}
          />
        </>
      )}
      {id && !editMode && (
        <>
          <Container>
            <Text>Priority:</Text>
            <Badge>{task?.priority}</Badge>
          </Container>
          <Container>
            <Text>Status:</Text>
            <Badge>{task?.status}</Badge>
          </Container>
        </>
      )}
    </Container>
  );
};

export default TaskDropdowns;

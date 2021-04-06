import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import { Container, Text } from "@chakra-ui/react";
import CustomTextareaControl from "components/common/CustomTextareaControl";

export interface ITaskDescriptionProps {
  id?: string;
  editMode: boolean;
  name: string;
}
const TaskDescription: FC<ITaskDescriptionProps> = ({
  id,
  editMode,
  name,
}) => {
  const task = useSelector(selectTask);
  return (
    <Container>
      {(!id || (id && editMode)) && (
        <>
          <CustomTextareaControl
            name={name}
            label={"Description: "}
            placeholder={"My Task's Name..."}
          />
        </>
      )}
      {id && !editMode && (
        <>
          <Text>Description: </Text>
          <Container>{task?.description}</Container>
        </>
      )}
    </Container>
  );
};

export default TaskDescription;

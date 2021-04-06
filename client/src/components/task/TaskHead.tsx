import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import ObjectID from "bson-objectid";
import { Container, Text, Badge } from "@chakra-ui/react";
import CustomInputControl from "components/common/CustomInputControl";

export interface TaskHeadProps {
  id?: string;
  editMode: boolean;
  name: string;
}
const TaskHead: FC<TaskHeadProps> = ({ id, editMode, name }) => {
  const task = useSelector(selectTask);
  return (
    <Container>
      {(!id || (id && editMode)) && (
        <>
          <CustomInputControl
            name={name}
            label={"Name: "}
            placeholder={"My Task's Name..."}
          />
        </>
      )}
      {id && !editMode && (
        <>
          <Text>{task?._id}</Text>
          <Text>{task?.title ? task?.title : ""}</Text>
          <Badge>
            Created on{" "}
            {new Date(new ObjectID(id).getTimestamp()).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </Badge>
        </>
      )}
    </Container>
  );
};

export default TaskHead;

import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import { Box, BoxProps, Text, Textarea } from "@chakra-ui/react";
import CustomTextareaControl from "components/common/CustomTextareaControl";

export interface ITaskDescriptionProps extends BoxProps {
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
    <Box>
      {(!id || (id && editMode)) && (
        <>
          <CustomTextareaControl
            name={name}
            label={"Description: "}
            placeholder={"My Task's Name..."}
          />
        </>
      )}
      {id && task && !editMode && (
        <>
          <Text
            fontSize={["xs", "sm"]} fontWeight="bold"
          >Description: </Text>
          <Textarea
            isReadOnly={true}
            value={task.description}
          />
        </>
      )}
    </Box>
  );
};

export default TaskDescription;

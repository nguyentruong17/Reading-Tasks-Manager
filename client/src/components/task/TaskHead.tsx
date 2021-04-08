import React, { FC } from "react";
import ObjectID from "bson-objectid";
//redux
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
//uis
import { Box, BoxProps, Text, Badge, Flex, Heading } from "@chakra-ui/react";
import { IoMdCreate } from "react-icons/io";
import CustomInputControl from "components/common/CustomInputControl";

export interface TaskHeadProps extends BoxProps {
  id?: string;
  editMode: boolean;
  name: string;
  handleClickEditMode: Function;
}
const TaskHead: FC<TaskHeadProps> = ({
  id,
  editMode,
  name,
  handleClickEditMode,
}) => {
  const task = useSelector(selectTask);
  return (
    <Box>
      {(!id || (id && editMode)) && (
        <>
          <CustomInputControl
            name={name}
            label={"Name: "}
            placeholder={"My Task's Name..."}
          />
        </>
      )}
      {id && task && !editMode && (
        <>
          <Flex
            direction="row"
            alignItems="center"
            mb={[0.5, 0.5, 1]}
          >
            <Text mr={[2, 2, 4]} fontSize={["xs", "xs", "sm"]} color="gray.500">
              ID #{task._id}
            </Text>
            <IoMdCreate
              style={{
                cursor: "pointer",
                fontSize: "111%",
                alignSelf: "flex-start",
              }}
              onClick={(e) => {
                handleClickEditMode(!editMode);
              }}
            />
          </Flex>

          <Heading size="md" mb={[1, 1, 2]}>
            {task.title}
          </Heading>
          <Badge fontSize={["xs", "xs", "sm"]} color="gray.500" textTransform="initial">
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
    </Box>
  );
};

export default TaskHead;

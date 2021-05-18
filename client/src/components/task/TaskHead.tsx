import React, { FC } from "react";
import ObjectId from "bson-objectid";
//redux
import { useDispatch, useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import {
  //
  OperationState,
  //actions
  setOperation,
  //selectors
  selectOperation,
  selectCurrentTaskId,
} from "features/task/crudTaskSlice";
//uis
import {
  Box,
  BoxProps,
  Text,
  Badge,
  Flex,
  Heading,
  Button,
} from "@chakra-ui/react";
import { IoMdCreate } from "react-icons/io";
import CustomInputControl from "components/common/CustomInputControl";

export interface TaskHeadProps extends BoxProps {
  name: string;
}
const TaskHead: FC<TaskHeadProps> = ({ name, ...rest }) => {
  const dispatch = useDispatch();

  //crudTask
  const operation = useSelector(selectOperation);
  const taskId = useSelector(selectCurrentTaskId);

  //task
  const task = useSelector(selectTask);

  return (
    <Box {...rest}>
      {(operation === OperationState.Create ||
        operation === OperationState.Update) && (
        <>
          <CustomInputControl
            name={name}
            label={"Name: "}
            placeholder={"My Task's Name..."}
          />
        </>
      )}
      {operation !== OperationState.Create &&
        operation !== OperationState.Update &&
        task &&
        taskId && (
          <>
            <Flex direction="row" alignItems="center" mb={[0.5, 0.5, 1]}>
              <Text
                mr={[2, 2, 4]}
                fontSize={["xs", "xs", "sm"]}
                color="gray.500"
              >
                ID #{task._id}
              </Text>
              <Button
                //stylings
                //my={[1, 1, 2]}
                w={[90]}
                h={[30]}
                fontSize="xs"
                fontWeight="thin"
                colorScheme="linkedin"

                //funcs
                onClick={(e) => {
                  dispatch(setOperation(OperationState.Update));
                }}
              >
                {"Edit"}
                <IoMdCreate
                  style={{
                    //cursor: "pointer",
                    //fontSize: "111%",
                    //alignSelf: "flex-start",
                    //marginTop: -1,
                    marginLeft: 8,
                    marginBottom: 4,
                  }}
                />
              </Button>
            </Flex>

            <Heading fontSize={["md", "lg", "xl"]} mb={[1, 1, 2]}>
              {task.title}
            </Heading>
            <Badge
              fontSize={["xs", "xs", "sm"]}
              color="gray.500"
              textTransform="initial"
            >
              Created on{" "}
              {new Date(new ObjectId(taskId).getTimestamp()).toLocaleDateString(
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

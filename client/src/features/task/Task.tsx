import React, { FC, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useParams } from "react-router-dom";
//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  initializeTask,
  updateTask,
  //selectors
  selectTaskLoading,
  selectTask,
} from "./taskSlice";
//uis

import { Container, Button, Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import TaskHead from "components/task/TaskHead";
import TaskDropdowns from "components/task/TaskDropdowns";
import TaskDescription from "components/task/TaskDescription";
import TaskAttachItem from "components/task/TaskAttachItem";
import {
  TaskStatus,
  TaskPriority,
  ViewTask_Task_Parts_Fragment,
} from "gql/generated/gql-types";

export interface RouteParams {
  taskId?: string;
}
type IFields = Omit<ViewTask_Task_Parts_Fragment, "attachItem" | '_id'> | null;
const ViewTask: FC = () => {
  const dispatch = useDispatch();
  const { taskId } = useParams<RouteParams>();
  const task = useSelector(selectTask);
  const loading = useSelector(selectTaskLoading);

  const [isEditMode, setIsEditMode] = useState<boolean>(taskId ? false : true);
  const [isChangeBookMode, setIsChangeBookMode] = useState<boolean>(false);
  const [defaultFields, setDefaultFields] = useState<IFields>(null);

  useEffect(() => {
    if (taskId) {
      dispatch(initializeTask({ taskId }));
    } else {
    }
  }, []);

  useEffect(() => {
    //console.log(task);
    if (task) {
      const { attachItem, _id,...rest } = task;
      setDefaultFields(rest);
    } else {
      setDefaultFields(null);
    }
    setIsEditMode(false);
    setIsChangeBookMode(false);
  }, [task]);

  useEffect(() => {
    setDefaultFields(null);
  }, [taskId]);

  const onSubmit = async (values: IFields) => {
    console.log(values);
    if (values){
      dispatch(
        updateTask({
          taskId,
          input: values,
        })
      );
    }
  };

  return (
    <Flex ml={[2, 2, 5]} flexGrow={1} direction={["column", "column", "row"]}>
      <Box
        //stylings
        flexGrow={[0, 0, 2]}
      >
        <Form
          //funcs
          onSubmit={onSubmit}
          initialValues={defaultFields}
          render={({ handleSubmit, form }) => (
            <form onSubmit={handleSubmit}>
              <Grid flexGrow={1}>
                <GridItem mb={[3, 3, 5]}>
                  <TaskHead
                    //stylings
                    //funcs
                    id={taskId}
                    editMode={isEditMode}
                    name={"title"}
                    handleClickEditMode={setIsEditMode}
                  />
                </GridItem>
                <GridItem mb={[3, 3, 5]}>
                  <TaskDropdowns
                    //stylings
                    //funcs
                    id={taskId}
                    editMode={isEditMode}
                    statusSelectName={"status"}
                    prioritySelectName={"priority"}
                  />
                </GridItem>
                <GridItem mb={[3, 3, 5]} w="80%">
                  <TaskDescription
                    id={taskId}
                    editMode={isEditMode}
                    name={"description"}
                  />
                </GridItem>
                <GridItem mb={[3, 3, 5]} w="80%">
                  <TaskAttachItem
                    id={taskId}
                    changeBookMode={isChangeBookMode}
                    name={"attachItem"}
                    handleClickChangeBook={setIsChangeBookMode}
                  />
                </GridItem>
                <GridItem>
                  <Container>
                    {(isEditMode || isChangeBookMode) && (
                      <Button
                        type="button"
                        // sets to the first page to trigger fetchIncidents effect
                        color="primary"
                        isLoading={loading}
                        onClick={() => {
                          setIsEditMode(false);
                          setIsChangeBookMode(false);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    {(isEditMode || isChangeBookMode) && (
                      <Button
                        type="submit"
                        // sets to the first page to trigger fetchIncidents effect
                        color="primary"
                        isActive={isEditMode}
                        isLoading={loading}
                      >
                        Submit
                      </Button>
                    )}
                  </Container>
                </GridItem>
              </Grid>
            </form>
          )}
        />
      </Box>
      <Box flexGrow={[0, 0, 1]}>
        <Form
          //stylings
          flexGrow={1}
          //funcs
          onSubmit={() => {
            console.log("hello");
          }}
          //initialValues={defaultFields}
          render={() => (
            <form>
              <Flex>Hello, World!</Flex>
            </form>
          )}
        />
      </Box>
    </Flex>
  );
};

export default ViewTask;

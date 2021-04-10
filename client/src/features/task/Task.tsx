import React, { FC, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useParams } from "react-router-dom";
//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  initializeTask,
  updateTask,
  changeAttachItem,
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
import { UpdateTaskInput } from "gql/generated/gql-types";

export interface RouteParams {
  taskId?: string;
}
type IFields = UpdateTaskInput;
const ViewTask: FC = () => {
  const dispatch = useDispatch();
  const { taskId } = useParams<RouteParams>();
  const task = useSelector(selectTask);
  const loading = useSelector(selectTaskLoading);

  const [isEditMode, setIsEditMode] = useState<boolean>(taskId ? false : true);
  const [isChangeBookMode, setIsChangeBookMode] = useState<boolean>(false);
  const [defaultFields, setDefaultFields] = useState<IFields>({});

  useEffect(() => {
    if (taskId) {
      dispatch(initializeTask({ taskId }));
    } else {
      setDefaultFields({});
    }
  }, [taskId]);

  useEffect(() => {
    //console.log(task);
    if (task) {
      const { _id, ...rest } = task;
      setDefaultFields(rest);
    } else {
      setDefaultFields({});
    }
    setIsEditMode(false);
    setIsChangeBookMode(false);
  }, [task]);

  // useEffect(() => {
  //   if(isChangeBookMode) {
  //     setIsEditMode(true);
  //   }
  // }, [isChangeBookMode])

  // const validate = (values: IFields) => {
  //   let errors: {
  //     [key: string]: string;
  //   } = {};
  //   let input: UpdateTaskInput = {};
  //   if (taskId) {
  //     //edit task
  //     if (isEditMode && isChangeBookMode) {
  //     } else {
  //       if (isEditMode) {
  //         input = values;
  //         delete input.openLibraryBookId;
  //         delete input.bookId;
  //         Object.entries(input).forEach(([k, v]) => {
  //           if (!!!v) {
  //             errors.k = "Required!";
  //           }
  //         });
  //       } else if (isChangeBookMode) {
  //         input = {};
  //         if (values.bookId) {
  //           input = {
  //             bookId: values.bookId,
  //           };
  //         }
  //         if (values.openLibraryBookId) {
  //           input = {
  //             ...input,
  //             openLibraryBookId: values.openLibraryBookId,
  //           };
  //         }
  //         if (Object.keys(input).length === 0) {
  //           const msg = "Either `openLibraryBookId` or `bookId` is required";
  //           errors.openLibraryBookId = msg;
  //           errors.bookId = msg;
  //         }
  //       }
  //     }
  //   } else {
  //     //new task
  //   }
  //   //console.log(errors);
  //   return errors;
  // };

  const onSubmit = async (values: IFields) => {
    //turn off all edit modes
    setIsEditMode(false);
    setIsChangeBookMode(false);

    //process input
    let input: UpdateTaskInput = {};
    if (taskId) {
      //edit task
      if (isEditMode && isChangeBookMode) {
        input = values;
      } else {
        if (isEditMode) {
          input = values;
          delete input.openLibraryBookId;
          delete input.bookId;
          dispatch(
            updateTask({
              taskId,
              input,
            })
          );
        } else if (isChangeBookMode) {
          input = {};
          if (values.bookId) {
            input = {
              bookId: values.bookId,
            };
          }
          if (values.openLibraryBookId) {
            input = {
              ...input,
              openLibraryBookId: values.openLibraryBookId,
            };
          }
          dispatch(
            changeAttachItem({
              taskId,
              input,
            })
          );
        } else {
          //none
        }
      }
    } else {
      //new task
      input = values;
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
          //validate={validate}
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

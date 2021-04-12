import React, { FC, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useParams } from "react-router-dom";
import ObjectId from "bson-objectid";
import { GraphQLClient } from "graphql-request";
//redux
import { AppDispatch } from "app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  initializeTask,
  updateTask,
  changeAttachItem,
  updateTaskAndChangeAttachItem,
  //selectors
  selectTaskLoading,
  selectTask,
} from "./taskSlice";
import { selectAuthJwtToken } from "features/auth/authSlice";
import { selectCurrentSelectedBook } from "features/search/searchSlice";
import {
  //
  OperationState,
  //actions
  setOperation,
  setCurrentTaskId,
  //selectors
  selectOperation,
  selectCreateWithSelectedBook,
  selectUpdateHasAttachItem,
} from "features/task/crudTaskSlice";
//uis

import { Button, Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import TaskHead from "components/task/TaskHead";
import TaskDropdowns from "components/task/TaskDropdowns";
import TaskDescription from "components/task/TaskDescription";
import TaskAttachItem from "components/task/TaskAttachItem";
import {
  getSdk,
  UpdateTaskInput,
  CreateTaskInput,
  TaskStatus,
  TaskPriority,
  CreateTaskMutationVariables,
} from "gql/generated/gql-types";
import History from "utils/history";
import { GQL_ENDPOINT } from "consts";

export interface RouteParams {
  taskId?: string;
}
type IFields = UpdateTaskInput & {
  bookId?: ObjectId;
  openLibraryBookId?: string;
};
const ViewTask: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const jwtToken = useSelector(selectAuthJwtToken);
  const { taskId } = useParams<RouteParams>();

  //crudTask
  const operation = useSelector(selectOperation);
  const createWithAttachItem = useSelector(selectCreateWithSelectedBook);
  const updateHasAttachItem = useSelector(selectUpdateHasAttachItem);

  //task
  const task = useSelector(selectTask);
  const loading = useSelector(selectTaskLoading);

  //selected book
  const currentSelectedBook = useSelector(selectCurrentSelectedBook);

  const defaulFields: IFields = {
    title: "My New Reading Task",
    description: "Describes my task...",
    status: TaskStatus.New,
    priority: TaskPriority.None,
  };
  const [initialFields, setInitialFields] = useState<IFields>(defaulFields);

  useEffect(() => {
    if (taskId) {
      const isValidObjectId = ObjectId.isValid(taskId);
      if (isValidObjectId) {
        dispatch(setCurrentTaskId(taskId));
        dispatch(setOperation(OperationState.Read));
        dispatch(initializeTask({ taskId }));
      } else {
        //raise some error
      }
    } else {
      dispatch(setOperation(OperationState.Create));
      setInitialFields(defaulFields);
    }
  }, [taskId]);

  useEffect(() => {
    initializeFields();
  }, [operation]);

  const initializeFields = () => {
    if (operation === OperationState.Create) {
      if (createWithAttachItem) {
        let fields: IFields = {};
        if (currentSelectedBook) {
          if (currentSelectedBook.bookId) {
            fields = {
              ...initialFields,
              bookId: currentSelectedBook.bookId,
            };
          } else {
            fields = {
              ...initialFields,
              openLibraryBookId: currentSelectedBook.openLibraryId,
            };
          }
        }
        setInitialFields(fields);
      } else {
        setInitialFields(defaulFields);
      }
    } else if (operation === OperationState.Read) {
      if (task) {
        const { _id, ...rest } = task;
        setInitialFields(rest);
      }
    } else if (operation === OperationState.Update) {
      if (task) {
        const { _id, ...rest } = task;
        setInitialFields(rest);
      }
    }
  };

  const validate = (values: IFields) => {
    const errors: {
      [key: string]: string;
    } = {};
    const commomFieldsToValidate = ["title", "description"];
    const attachItemFields = ["bookId", "openLibraryBookId"];

    const validateCommonFields = () => {
      // const commonFieldsErrors: {
      //   [key: string]: string;
      // } = {};
      commomFieldsToValidate.forEach((f) => {
        if (!(f in values)) {
          errors[f] = "Required!";
        }
      });
    };

    const validateAttachItemFields = () => {
      let hasAttachItem = false;
      for (const f of attachItemFields) {
        if (f in values) {
          hasAttachItem = true;
          break;
        }
      }
      if (!hasAttachItem) {
        errors["attachItem"] = "Required!";
      }
    };

    if (operation === OperationState.Update) {
      validateCommonFields();
      if (updateHasAttachItem) {
        validateAttachItemFields();
      }
    } else if (operation === OperationState.UpdateAttachItemOnly) {
      validateCommonFields();
    } else if (operation === OperationState.Create) {
      validateCommonFields();
      validateAttachItemFields();
    }
    return errors;
  };

  const createTask = async (args: CreateTaskMutationVariables) => {
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    const { createTask } = await sdk.createTask(args);
    return createTask;
  };

  const onSubmit = async (values: IFields) => {
    dispatch(setOperation(OperationState.Read));
    //process input
    if (operation === OperationState.Update) {
      let input: UpdateTaskInput = {};
      input = values;
      if (updateHasAttachItem) {
        dispatch(
          updateTaskAndChangeAttachItem({
            taskId,
            input,
          })
        );
      } else {
        delete input.openLibraryBookId;
        delete input.bookId;
        dispatch(
          updateTask({
            taskId,
            input,
          })
        );
      }
    } else if (operation === OperationState.UpdateAttachItemOnly) {
      let input: UpdateTaskInput = {};
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
    } else if (operation === OperationState.Create) {
      const v = { ...values };
      delete v.status;

      //@ts-ignore: should validated with the validation
      const input: CreateTaskInput = v;
      const task = await createTask({ input });
      History.push(`/tasks/${task._id}`);
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
          validate={validate}
          onSubmit={onSubmit}
          initialValues={initialFields}
          render={({ handleSubmit, form, hasValidationErrors }) => (
            <form onSubmit={handleSubmit}>
              <Grid flexGrow={1}>
                <GridItem mb={[3, 3, 5]}>
                  <TaskHead
                    //stylings
                    //funcs
                    name={"title"}
                  />
                </GridItem>
                <GridItem mb={[3, 3, 5]}>
                  <TaskDropdowns
                    //stylings
                    //funcs
                    statusSelectName={"status"}
                    prioritySelectName={"priority"}
                  />
                </GridItem>
                <GridItem mb={[3, 3, 5]} w="80%">
                  <TaskDescription name={"description"} />
                </GridItem>
                <GridItem mb={[3, 3, 5]} w="80%">
                  <TaskAttachItem />
                </GridItem>
                <GridItem>
                  <Flex alignItems="center" justifyContent="flex-end">
                    {(operation === OperationState.Create ||
                      operation === OperationState.Update ||
                      operation === OperationState.UpdateAttachItemOnly) && (
                      <Button
                        type="button"
                        // sets to the first page to trigger fetchIncidents effect
                        variant="ghost"
                        colorScheme="green"
                        isLoading={loading}
                        onClick={() => {
                          //reset initial fields
                          initializeFields();

                          if (operation !== OperationState.Create) {
                            dispatch(setOperation(OperationState.Read));
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    {(operation === OperationState.Create ||
                      operation === OperationState.Update ||
                      operation === OperationState.UpdateAttachItemOnly) && (
                      <Button
                        type="submit"
                        colorScheme="green"
                        isLoading={loading}
                        isDisabled={hasValidationErrors}
                      >
                        Submit
                      </Button>
                    )}
                  </Flex>
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
          //initialValues={initialFields}
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

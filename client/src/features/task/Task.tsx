import React, { FC, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useParams } from "react-router-dom";
//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  initializeTask,
  //selectors
  selectTaskLoading,
  selectTask,
} from "./taskSlice";
//uis

import { Container, Button, Spinner } from "@chakra-ui/react";
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
type IFields = ViewTask_Task_Parts_Fragment | null;
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
    console.log(task);
    setDefaultFields(task);
    setIsEditMode(true)
  }, [task]);

  useEffect(() => {
    setDefaultFields(null)
  }, [taskId])

  const onSubmit = async (values: IFields) => {
    console.log(values);
  };

  return (
    <Container>
      <Form
        onSubmit={onSubmit}
        initialValues={defaultFields}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <TaskHead id={taskId} editMode={isEditMode} name={"title"} />
            <TaskDropdowns
              id={taskId}
              editMode={isEditMode}
              statusSelectName={"status"}
              prioritySelectName={"priority"}
            />
            <TaskDescription
              id={taskId}
              editMode={isEditMode}
              name={"description"}
            />
            <TaskAttachItem
              id={taskId}
              changeBookMode={isChangeBookMode}
              handleClickChangeBook={setIsChangeBookMode}
              name={"attachItem"}
            />
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
          </form>
        )}
      />
    </Container>
  );
};

export default ViewTask;

import React, { FC } from "react";
import { Button, Container } from "@chakra-ui/react";
import FetchTasksForm from "components/tasks/FetchTasksForm";
import TasksTable from "components/tasks/TasksTable";

//redux
import { useDispatch, useSelector } from 'react-redux';
import {
  //actions
  loadNextTasks,
  //selectors
  selectTasks,
  selectTasksLoading,
  selectTasksPagination,
} from "./tasksSlice"

const ViewTasks: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTasksLoading);
  const pagination = useSelector(selectTasksPagination);
  const tasks = useSelector(selectTasks);
  const numTasksLeft = pagination.count - tasks.length;
  return (
    <Container>
      <FetchTasksForm />
      <TasksTable />
      <Button
        isLoading={loading}
        isDisabled={numTasksLeft === 0}
        onClick={(e) => {
          e.preventDefault();
          dispatch(loadNextTasks({}));
        }}
      >
        Load more ({numTasksLeft})
      </Button>
    </Container>
  );
};

export default ViewTasks;

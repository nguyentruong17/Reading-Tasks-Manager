import React, { FC } from "react";
import { Button, Flex, Stack } from "@chakra-ui/react";
import FetchTasksForm from "components/tasks/FetchTasksForm";
import TasksTable from "components/tasks/TasksTable";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  loadNextTasks,
  //selectors
  selectTasks,
  selectTasksLoading,
  selectTasksPagination,
} from "./tasksSlice";

const ViewTasks: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTasksLoading);
  const pagination = useSelector(selectTasksPagination);
  const tasks = useSelector(selectTasks);
  const numTasksLeft = pagination.count - tasks.length;
  return (
    <Flex
      ml={[1, 1, 2]} 
      flexGrow={1}
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <FetchTasksForm width="50%" alignSelf="flex-start"/>
      <TasksTable/>
      <Button
        //stylings
        mx="35% 35%"
        //funcs
        isLoading={loading}
        isDisabled={numTasksLeft === 0}
        onClick={(e) => {
          //e.preventDefault();
          dispatch(loadNextTasks({}));
        }}
      >
        Load more ({numTasksLeft})
      </Button>
    </Flex>
  );
};

export default ViewTasks;

import React, { FC } from "react";
import { Container, Table, Tr } from "@chakra-ui/react";
import FetchTasksForm from "components/tasks/FetchTasksForm";
import TasksTable from "components/tasks/TasksTable";

const ViewTasks: FC = () => {
  return (
    <Container>
      <FetchTasksForm />
      <TasksTable />
    </Container>
  );
};

export default ViewTasks;

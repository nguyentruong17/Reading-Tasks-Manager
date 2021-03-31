import React, { useState, useEffect, FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectTasksLoading, selectTasks } from "features/tasks/tasksSlice";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
} from "@chakra-ui/react";

const TasksTable: FC = () => {
  const isLoading = useSelector(selectTasksLoading);
  const tasks = useSelector(selectTasks);
  //const dispatch = useDispatch();

  return (
    <>
      {isLoading ? (
        <>
          <Spinner></Spinner>
        </>
      ) : (
        <div>
          <Table variant="simple">
            <TableCaption>Tasks</TableCaption>
            <Thead>
              <Tr>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Book</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => {
                return (
                  <Tr key={task._id}>
                    <Td>{task.priority}</Td>
                    <Td>{task.status}</Td>
                    <Td>{task.title}</Td>
                    <Td>{task.description}</Td>
                    <Td>{task.attachItem.title}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default (TasksTable)

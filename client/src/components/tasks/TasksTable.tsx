import React, { FC } from "react";
import { useSelector } from "react-redux";

import { selectTasksLoading, selectTasks } from "features/tasks/tasksSlice";
import {
  Box,
  BoxProps,
  Badge,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
} from "@chakra-ui/react";
import { Status, Priorities } from "consts";
import History from 'utils/history';

const TasksTable: FC<BoxProps> = (props) => {
  const isLoading = useSelector(selectTasksLoading);
  const tasks = useSelector(selectTasks);
  //const dispatch = useDispatch();

  return (
    <Box {...props}>
      {isLoading ? (
        <>
          <Spinner></Spinner>
        </>
      ) : (
        <div>
          <Table variant="simple" width="full">
            <TableCaption>Tasks</TableCaption>
            <Thead>
              <Tr>
                <Th display={{ base: "none", md: "block" }}>Status</Th>
                <Th>Priority</Th>
                <Th>Title</Th>
                <Th display={{ base: "none", md: "block" }}>Description</Th>
                <Th>Attach Item</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => {
                return (
                  <Tr key={task._id}>
                    <Td display={{ base: "none", md: "block" }}>
                      <Box
                        bg={Status[task.status].color}
                        // color="white"
                        borderRadius="xl"
                        py={0}
                        px={[2, 2, 4]}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        textAlign="center"
                        maxW="110px"
                        whiteSpace="nowrap"
                      >
                        {Status[task.status].name}
                      </Box>
                    </Td>
                    <Td>
                      <Badge
                        variant="solid"
                        ml={1}
                        px={[2, 2, 4]}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        maxW="110px"
                        colorScheme={Priorities[task.priority].color}
                      >
                        {Priorities[task.priority].name}
                      </Badge>
                    </Td>
                    <Td
                      style={{ cursor: "pointer" }}
                      onClick={e => {
                        History.push(`/tasks/${task._id}`)
                      }}
                    >{task.title}</Td>
                    <Td display={{ base: "none", md: "block" }}>
                      {task.description}
                    </Td>
                    <Td>{task.attachItem.title}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      )}
    </Box>
  );
};

export default TasksTable;

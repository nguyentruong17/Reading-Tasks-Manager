import React, { FC, useRef, useCallback, useState } from "react";
//redux
import { AppDispatch } from "app/store";
import { useSelector, useDispatch } from "react-redux";
import {
  //actions
  deleteTask,
  //reducers
  selectTasksLoading,
  selectTasks,
} from "features/tasks/tasksSlice";
import {
  //
  OperationState,
  //actions
  setOperation,
} from "features/task/crudTaskSlice";
//uis
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
  Text,
  Container,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import { Status, Priorities } from "consts";
import History from "utils/history";
//graphql

const TasksTable: FC<BoxProps> = (props) => {
  const dispatch: AppDispatch = useDispatch();

  const isLoading = useSelector(selectTasksLoading);
  const tasks = useSelector(selectTasks);

  const observer = useRef<IntersectionObserver>();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {});
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  const [taskIdToDelete, setTaskIdToDelete] = useState("");
  const [taskIndexToDelete, setTaskIndexToDelete] = useState(-1);
  const [deleting, setDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  const toast = useToast()

  const onClickDelete = (index: number) => {
    const task = tasks[index];
    setTaskIdToDelete(task._id);
    setTaskIndexToDelete(index);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    let deletedId: string = "";

    const result = await dispatch(
      deleteTask({
        taskId: taskIdToDelete,
        index: taskIndexToDelete,
      })
    );
    setDeleting(false);
    setIsOpen(false);
    if (deleteTask.fulfilled.match(result)) {
      toast({
        title: "Task Deleted!",
        description: `We've deleted task ${taskIdToDelete}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: "Delete Fail!",
        description: `Error while deleting task ${taskIdToDelete}. Please try again.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }

    
    
    return deletedId;
  };

  // useEffect(() => {

  // }, [])

  return (
    <Box {...props}>
      {isLoading ? (
        <>
          <Spinner />
          Fetching...
        </>
      ) : (
        <>
          <Table variant="simple" width="full">
            <TableCaption>Tasks</TableCaption>
            <Thead>
              <Tr>
                <Th display={{ base: "none", md: "block" }}>Status</Th>
                <Th>Priority</Th>
                <Th>Title</Th>
                <Th display={{ base: "none", md: "block" }}>Description</Th>
                <Th>Attach Item</Th>
                <Th>Delete?</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task, index) => {
                return (
                  <Tr
                    key={index}
                    ref={
                      tasks.length === index + 1
                        ? lastBookElementRef
                        : undefined
                    }
                  >
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
                      onClick={(e) => {
                        dispatch(setOperation(OperationState.Read));
                        History.push(`/tasks/${task._id}`);
                      }}
                    >
                      <Text noOfLines={2}>{task.title}</Text>
                    </Td>
                    <Td display={{ base: "none", md: "block" }}>
                      <Text noOfLines={2}>{task.description}</Text>
                    </Td>
                    <Td>
                      <Text noOfLines={2}>{task.attachItem.title}</Text>
                    </Td>
                    <Td>
                      <Container
                        alignItems="center"
                        onClick={() => onClickDelete(index)}
                      >
                        <IoMdTrash color="red" />
                      </Container>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Task
                </AlertDialogHeader>

                <AlertDialogBody>
                  {deleting
                    ? "Deleting..."
                    : "Are you sure? You can't undo this action afterwards."}
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={cancelRef}
                    onClick={() => setIsOpen(false)}
                    isLoading={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDelete}
                    ml={3}
                    isLoading={deleting}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </Box>
  );
};

export default TasksTable;

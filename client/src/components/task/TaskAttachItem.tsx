import React, { FC, useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import {
  selectAttachItem,
  selectAttachItemLoading,
} from "features/task/taskSlice";
import {
  //
  OperationState,
  //actions
  setOperation,
  //selectors
  selectOperation,
  selectCreateWithSelectedBook,
  selectUpdateHasAttachItem,
} from "features/task/crudTaskSlice";
import { selectCurrentSelectedBook } from "features/search/searchSlice";
//uis
import {
  Box,
  BoxProps,
  Button,
  Container,
  Text,
  Image,
  AspectRatio,
  Flex,
  Spinner,
} from "@chakra-ui/react";

import TaskChangeAttachItem from "./TaskChangeAttachItem";
import { ViewTask_AttachItem_Parts_Fragment } from "gql/generated/gql-types";

export interface ITaskAttachItemProps extends BoxProps {}
const TaskAttachItem: FC<ITaskAttachItemProps> = ({ ...rest }) => {
  const dispatch = useDispatch();

  const currentSelectedBook = useSelector(selectCurrentSelectedBook);
  const loading = useSelector(selectAttachItemLoading);

  //crudTask
  const operation = useSelector(selectOperation);
  const createWithAttachItem = useSelector(selectCreateWithSelectedBook);
  const updateHasAttachItem = useSelector(selectUpdateHasAttachItem);

  //attachItem
  const attachItem = useSelector(selectAttachItem);
  const [item, setItem] = useState<ViewTask_AttachItem_Parts_Fragment | null>(
    null
  );
  const [isChangingItem, setIsChangingItem] = useState<boolean>(false);

  useEffect(() => {
    if (operation === OperationState.Create) {
      if (createWithAttachItem) {
        setIsChangingItem(false);
      } else {
        setIsChangingItem(true);
      }
    } else if (operation === OperationState.Update) {
      if (updateHasAttachItem) {
        setIsChangingItem(true);
      } else {
        setIsChangingItem(false);
      }
    } else if (operation === OperationState.UpdateAttachItemOnly) {
      setIsChangingItem(true);
    } else if (operation === OperationState.Read) {
      setIsChangingItem(false);
    }
  }, [operation]);

  useEffect(() => {
    setItem(attachItem);
  }, [attachItem]);

  useEffect(() => {
    if (currentSelectedBook) {
      setItem(currentSelectedBook as ViewTask_AttachItem_Parts_Fragment);
    }
  }, [currentSelectedBook]);

  useEffect(() => {
    if (operation === OperationState.Update) {
      if (!updateHasAttachItem) {
        setItem(attachItem);
        setIsChangingItem(false);
      }
    }
  }, [updateHasAttachItem]);

  if (loading) {
    return <Spinner>Loading Attach Item...</Spinner>;
  }
  return (
    <Box {...rest}>
      <Text fontSize={["xs", "sm"]} fontWeight="bold" mb={[2, 1]}>
        Attach Item:{" "}
      </Text>
      {isChangingItem && (
        <TaskChangeAttachItem handleClickSelect={setIsChangingItem} />
      )}
      {!isChangingItem && item && (
        <Box>
          <Flex direction={["column", "row"]} flexGrow={1}>
            <Flex justifyContent={"center"}>
              <AspectRatio ratio={2 / 3} minW={[100, 120, 180]} mr={[2, 4, 4]}>
                <Image
                  borderRadius="sm"
                  src={
                    item.covers
                      ? item.covers.length > 0
                        ? item.covers[0]
                          ? item.covers[0][2]
                            ? item.covers[0][2]
                            : undefined
                          : undefined
                        : undefined
                      : undefined
                  }
                  fallbackSrc={`https://via.placeholder.com/200x300?text=${item.title}`}
                />
              </AspectRatio>
            </Flex>

            <Flex direction="column" flexGrow={1}>
              <Flex
                direction={["column-reverse", "row"]}
                my={[1, 2]}
                flexGrow={3}
              >
                <Flex
                  direction="column"
                  alignItems={["center", "flex-start"]}
                  flexGrow={1}
                >
                  <Text
                    fontSize={["sm", "md", "lg"]}
                    color="green.700"
                    fontWeight="bold"
                    textTransform="capitalize"
                    noOfLines={[2, 3]}
                    mr={[1, 2]}
                    my={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize={["xs", "sm", "md"]}
                    color="yellow.600"
                    noOfLines={2}
                    mr={[1, 2]}
                  >
                    by {item.authors.join(", ")}
                  </Text>
                </Flex>
                <Flex
                  justifyContent={["center", "flex-end"]}
                  alignItems="center"
                  flexGrow={1}
                >
                  <Button
                    //styling
                    size="xs"
                    fontSize="xs"
                    fontWeight="thin"
                    colorScheme="linkedin"
                    mt={2}
                    //func
                    onClick={(e) => {
                      setIsChangingItem(true);
                      dispatch(
                        setOperation(OperationState.UpdateAttachItemOnly)
                      );
                    }}
                  >
                    Change
                  </Button>
                </Flex>
              </Flex>
              <Flex
                justifyItems="flex-start"
                alignItems="flex-end"
                flexGrow={1}
              >
                <Container
                  fontSize={["xs", "sm"]}
                  display={item.subjects.length > 0 ? "initial" : "none"}
                  noOfLines={[2, 3]}
                  px={0}
                  ml={0}
                >
                  Subjects: {item.subjects.join(", ")}
                </Container>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default TaskAttachItem;

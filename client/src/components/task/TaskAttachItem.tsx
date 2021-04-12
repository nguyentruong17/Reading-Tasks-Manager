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
  //current selected book
  const [isChangingItem, setIsChangingItem] = useState<boolean>(false);

  useEffect(() => {
    setItem(attachItem);
  }, [attachItem]);

  useEffect(() => {
    if (currentSelectedBook) {
      setItem(currentSelectedBook as ViewTask_AttachItem_Parts_Fragment);
    }
  }, [currentSelectedBook]);

  useEffect(() => {
    if (!updateHasAttachItem) {
      setItem(attachItem);
      setIsChangingItem(false);
    }
  }, [updateHasAttachItem]);

  if (loading) {
    return <Spinner>Loading Attach Item...</Spinner>;
  }
  return (
    <Box {...rest}>
      {isChangingItem &&
        ((operation === OperationState.Create && !createWithAttachItem) ||
          (operation === OperationState.Update && updateHasAttachItem) ||
          operation === OperationState.UpdateAttachItemOnly) && (
          <TaskChangeAttachItem handleClickSelect={setIsChangingItem} />
        )}
      {!isChangingItem &&
        item &&
        (operation === OperationState.Read ||
          (operation === OperationState.Create && createWithAttachItem) ||
          (operation === OperationState.Update) ||
          operation === OperationState.UpdateAttachItemOnly) && (
          <Box>
            <Text fontSize={["xs", "sm"]} fontWeight="bold">
              Attach Item:{" "}
            </Text>
            <Flex direction="row" flexGrow={1}>
              <AspectRatio ratio={2 / 3} minW={[120, 180, 180]} mr={[2, 4, 4]}>
                <Image
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
              <Flex direction="column" flexGrow={1}>
                <Flex direction="row" flexGrow={3}>
                  <Flex direction="column" flexGrow={1}>
                    <Text
                      fontSize={["md", "lg", "xl"]}
                      color="green.700"
                      textTransform="capitalize"
                      mr={[1, 2]}
                      mb={[1, 2]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      fontSize={["xs", "sm", "md"]}
                      color="yellow.600"
                      mr={[1, 2]}
                    >
                      by {item.authors.slice(0, 2).join(", ")}
                    </Text>
                  </Flex>
                  <Flex justifyContent="flex-end" flexGrow={1}>
                    <Button
                      //styling
                      size="sm"
                      //func
                      onClick={(e) => {
                        setIsChangingItem(true);
                        dispatch(
                          setOperation(OperationState.UpdateAttachItemOnly)
                        );
                      }}
                    >
                      Change Book
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
                    overflow="hidden"
                    textOverflow="ellipsis"
                    px={0}
                    ml={0}
                  >
                    Subjects: {item.subjects.slice(0, 10).join(", ")}
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

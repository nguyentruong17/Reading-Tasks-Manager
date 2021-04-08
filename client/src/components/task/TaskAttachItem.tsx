import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import {
  Box,
  BoxProps,
  Button,
  Container,
  Text,
  Image,
  AspectRatio,
  Flex,
} from "@chakra-ui/react";

export interface ITaskAttachItemProps extends BoxProps {
  id?: string;
  changeBookMode: boolean;
  name: string;
  handleClickChangeBook: Function;
}
const TaskAttachItem: FC<ITaskAttachItemProps> = ({
  id,
  changeBookMode,
  handleClickChangeBook,
}) => {
  const task = useSelector(selectTask);
  return (
    <Box>
      {(!id || (id && changeBookMode)) && (
        <Box>
          <Text>To be implemented...</Text>
        </Box>
      )}
      {id && task && !changeBookMode && (
        <Box>
          <Text fontSize={["xs", "sm"]} fontWeight="bold">
            Attach Item:{" "}
          </Text>
          <Flex direction="row" flexGrow={1}>
            <AspectRatio ratio={2 / 3} minW={[120, 180, 180]} mr={[2, 4, 4]}>
              <Image
                src={task.attachItem.covers[0][1]}
                fallbackSrc={`https://via.placeholder.com/200x300?text=${task.attachItem.title}`}
              />
            </AspectRatio>
            <Flex direction="column" flexGrow={1}>
              <Flex direction="row" flexGrow={3}>
                <Flex direction="column" flexGrow={1}>
                  <Text
                    fontSize={["md", "lg", "xl"]}
                    color="green.700"
                    mr={[1, 2]}
                    mb={[1, 2]}
                  >
                    {task.attachItem.title}
                  </Text>
                  <Text
                    fontSize={["xs", "sm", "md"]}
                    color="yellow.600"
                    mr={[1, 2]}
                  >
                    by {task.attachItem.authors.slice(0, 2).join(', ')}
                  </Text>
                </Flex>
                <Flex justifyContent="flex-end" flexGrow={1}>
                  <Button
                    //styling
                    size="sm"
                    //func
                    onClick={(e) => {
                      handleClickChangeBook(!changeBookMode);
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
                alignSelf="flex-end"
              >
                <Container
                  fontSize={["xs", "sm"]}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  px={0}
                >
                  Subjects:{" "} 
                  {task.attachItem.subjects.slice(0, 10).join(', ')}
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

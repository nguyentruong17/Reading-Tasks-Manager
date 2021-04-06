import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectTask } from "features/task/taskSlice";
import { Button, Container, Text, Image, AspectRatio } from "@chakra-ui/react";

export interface ITaskAttachItemProps {
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
    <Container>
      {(!id || (id && changeBookMode)) && (
        <>
          <Text>To be implemented...</Text>
        </>
      )}
      {id && !changeBookMode && (
        <>
          <Text>Attach Item: </Text>
          <Container>
            <AspectRatio ratio={2 / 3}>
              <Image
                src={task?.attachItem.covers[0][1]}
                fallbackSrc={`https://via.placeholder.com/200x300?text=${task?.attachItem.title}`}
              />
            </AspectRatio>
            <Text>{task?.attachItem.title}</Text>
            <Text>{task?.attachItem.authors}</Text>
            <Button
              onClick={(e) => {
                handleClickChangeBook(!changeBookMode);
              }}
            >
              Change Book
            </Button>
            <Container>{task?.attachItem.subjects}</Container>
          </Container>
        </>
      )}
    </Container>
  );
};

export default TaskAttachItem;

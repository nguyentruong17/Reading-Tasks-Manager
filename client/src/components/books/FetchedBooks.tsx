import React, { FC, useState, useEffect, useRef, useCallback } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { 
  //actions
  loadNextBooks,
  //selectors
  selectBooks,
  selectBooksError,
  selectBooksLoading,
  selectBooksPagination  
} from "features/books/booksSlice";
import {
  ISelectedBook,
  //actions
  setCurrentSelectedBook,
} from "features/search/searchSlice";
import {
  OperationState,
  setOperation,
  setCreateWithSelectedBook,
} from "features/task/crudTaskSlice";
//uis
import {
  FlexProps,
  Flex,
  Image,
  Text,
  Button,
  Container,
  AspectRatio,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import History from "utils/history";

export interface IFetchedBooksProps extends FlexProps {
  handleChangeSearching: React.Dispatch<React.SetStateAction<boolean>>; 
}
const FetchedBooks: FC<IFetchedBooksProps> = ({handleChangeSearching, ...rest}) => {
  const dispatch = useDispatch();
  const displayingImageIndex = useBreakpointValue({ base: 1, md: 2 }) || 1;

  const books = useSelector(selectBooks);
  const loading = useSelector(selectBooksLoading);
  const error = useSelector(selectBooksError);
  const pagination = useSelector(selectBooksPagination);


  const observer = useRef<IntersectionObserver>();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {});
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <Flex bgColor="gray.50" wrap="wrap" {...rest}>
      {books.map((b, index) => (
        
        <Flex
          justifyContent="center"
          mr={[2, 4]}
          mb={[3, 6]}
          key={b._id}
          //funcs
          ref={books.length === index + 1 ? lastBookElementRef : undefined}
        >
          <Flex
            direction="column"
            w={[150 + 2, 175 + 2, 200 + 2]}
            justifyContent="center"
            alignItems="center"
          >
            <AspectRatio
              ratio={2 / 3}
              w={[150, 175, 200]}
              mt={[1, 1, 2]}
              mb={[1, 1, 2]}
              filter={"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));"}
            >
              <Image
                //styling
                borderRadius={["sm", "md"]}
                //funcs
                src={
                  b.covers
                    ? b.covers.length > 0
                      ? b.covers[0]
                        ? b.covers[0][displayingImageIndex]
                          ? b.covers[0][displayingImageIndex] || undefined
                          : undefined
                        : undefined
                      : undefined
                    : undefined
                }
                fallbackSrc={`https://via.placeholder.com/200x300?text=${b.title}`}
              />
            </AspectRatio>
            <Text
              fontSize={["xs", "sm", "md"]}
              //fontWeight="bold"
              textTransform="capitalize"
              noOfLines={1}
              mr={[1, 2]}
              my={2}
            >
              {b.title}
            </Text>
            <Button
              //styling
              w="80%"
              h={["18", "18", "25"]}
              fontSize={["xs", "sm"]}
              fontWeight="light"
              colorScheme="green"
              mb={[1, 1, 2]}
              //funcs
              onClick={() => {
                dispatch(setCurrentSelectedBook(b as ISelectedBook));
                dispatch(setCreateWithSelectedBook(true));
                dispatch(setOperation(OperationState.Create));
                History.push("/newTask");
              }}
            >
              Read Again
            </Button>
          </Flex>
        </Flex>
      ))}

      {!loading && error.code === "-1" && (
        <Flex
          w={[150, 175, 200]}
          h={[(150 / 3) * 4 + 10, (175 / 3) * 4 + 12, (200 / 3) * 4 + 15]}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            size="sm"
            fontSize="sm"
            fontWeight="medium"
            colorScheme="linkedin"
            isDisabled={(pagination.count - books.length) === 0}
            onClick={() => {
              dispatch(loadNextBooks({}));
            }}
          >
            Fetch ({pagination.count - books.length} left)
          </Button>
        </Flex>
      )}

      {loading && (
        <Flex
          w={[150, 175, 200]}
          h={[(150 / 3) * 4 + 10, (175 / 3) * 4 + 12, (200 / 3) * 4 + 15]}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color="green.500" mr={2} />
          Fetching...
        </Flex>
      )}
      {error.code !== "-1" && (
        <Flex
          w={[150, 175, 200]}
          h={[(150 / 3) * 4 + 10, (175 / 3) * 4 + 12, (200 / 3) * 4 + 15]}
          alignItems="center"
          justifyContent="center"
        >
          <Container>Error. Please try again later.</Container>
        </Flex>
      )}
    </Flex>
  );
};

export default FetchedBooks;

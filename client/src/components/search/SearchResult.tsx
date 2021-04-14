import React, { FC, useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import useOpenLibrayBookSearch from "features/search/useOpenLibrayBookSearch";
import useUsersAddedBookSearch from "features/search/useUsersAddedBookSearch";
//redux
import { useSelector } from "react-redux";
import {
  ISelectedBook,
  //actions
  setCurrentSelectedBook,
  //selecors
  selectIsSearchingOpenLibrary,
  selectCurrentOpenLibrarySearch,
  selectCurrentUsersAddedSearch,
} from "features/search/searchSlice";
import {
  OperationState,
  setOperation,
  setCreateWithSelectedBook,
} from "features/task/crudTaskSlice";

//uis
import {
  Box,
  BoxProps,
  Flex,
  Image,
  Text,
  Button,
  Container,
  AspectRatio,
  Spinner,
} from "@chakra-ui/react";
import ObjectId from "bson-objectid";
import History from "utils/history";

export interface ISearchResultProps extends BoxProps {}
const SearchResult: FC<ISearchResultProps> = () => {
  const dispatch = useDispatch();
  const isSearchingOpenLibrary = useSelector(selectIsSearchingOpenLibrary);
  const currentOpenLibrarySearch = useSelector(selectCurrentOpenLibrarySearch);
  const currentUsersAddedSearch = useSelector(selectCurrentUsersAddedSearch);

  const [pageNumber, setPageNumber] = useState(0);
  const {
    books: openLibBooks,
    hasMore: openLibHasMore,
    loading: openLibLoading,
    error: openLibError,
  } = useOpenLibrayBookSearch(pageNumber);

  const {
    books: userAddedBooks,
    hasMore: userAddedHasMore,
    loading: userAddedLoading,
    error: userAddedError,
  } = useUsersAddedBookSearch(pageNumber);

  type DisplayingBook = {
    openLibraryId: string;
    title: string;
    authors: string[];
    covers: string[][];
    _id?: string;
    timesAdded?: number;
  };
  const [displayingBooks, setDisplayingBooks] = useState<DisplayingBook[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setPageNumber(0);
  }, [
    currentOpenLibrarySearch,
    currentUsersAddedSearch,
    isSearchingOpenLibrary,
  ]);

  useEffect(() => {
    if (isSearchingOpenLibrary) {
      setDisplayingBooks(openLibBooks as DisplayingBook[]);
      setIsLoading(openLibLoading);
      setIsError(openLibError);
      setHasMore(openLibHasMore);
    } else {
      setDisplayingBooks(userAddedBooks as DisplayingBook[]);
      setIsLoading(userAddedLoading);
      setIsError(userAddedError);
      setHasMore(userAddedHasMore);
    }
  }, [isSearchingOpenLibrary]);

  useEffect(() => {
    if (isSearchingOpenLibrary) {
      setDisplayingBooks(openLibBooks as DisplayingBook[]);
    } else {
      setDisplayingBooks(userAddedBooks as DisplayingBook[]);
    }
  }, [openLibBooks, userAddedBooks]);

  useEffect(() => {
    if (isSearchingOpenLibrary) {
      setIsLoading(openLibLoading);
    } else {
      setIsLoading(userAddedLoading);
    }
  }, [openLibLoading, userAddedLoading]);

  useEffect(() => {
    if (isSearchingOpenLibrary) {
      setIsError(openLibError);
    } else {
      setIsError(userAddedError);
    }
  }, [openLibError, userAddedError]);

  useEffect(() => {
    if (isSearchingOpenLibrary) {
      setHasMore(openLibHasMore);
    } else {
      setHasMore(userAddedHasMore);
    }
  }, [openLibHasMore, userAddedHasMore]);

  const observer = useRef<IntersectionObserver>();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <Box>
      {displayingBooks.map((book, index) => (
        <Flex
          //stylings
          direction={["column", "row"]}
          flexGrow={1}
          mb={2}
          p={[2, 3]}
          bgColor="yellow.50"
          borderRadius="md"
          filter={"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));"}
          //funcs
          ref={
            displayingBooks.length === index + 1
              ? lastBookElementRef
              : undefined
          }
        >
          <Flex justifyContent={"space-around"}>
            <AspectRatio ratio={2 / 3} minW={[100, 120]} mr={[2, 4, 4]}>
              <Image
                borderRadius="sm"
                src={
                  book.covers
                    ? book.covers.length > 0
                      ? book.covers[0]
                        ? book.covers[0][1]
                          ? book.covers[0][1]
                          : undefined
                        : undefined
                      : undefined
                    : undefined
                }
                fallbackSrc={`https://via.placeholder.com/200x300?text=${book.title}`}
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
                  fontWeight="bold"
                  textTransform="capitalize"
                  mr={[1, 2]}
                  my={[1, 2]}
                >
                  {book.title}
                </Text>
                <Text
                  fontSize={["xs", "sm", "md"]}
                  mr={[1, 2]}
                  display={book.authors.length > 0 ? "block" : "none"}
                >
                  by {book.authors.slice(0, 2).join(", ")}
                </Text>
              </Flex>
              <Flex
                justifyContent={["center", "flex-end"]}
                alignItems="center"
                flexGrow={1}
              >
                <Button
                  //styling
                  size="sm"
                  fontSize="sm"
                  fontWeight="normal"
                  colorScheme="green"
                  //func
                  onClick={(e) => {
                    console.log("want to read");
                    dispatch(setCurrentSelectedBook(book as ISelectedBook));
                    dispatch(setCreateWithSelectedBook(true));
                    dispatch(setOperation(OperationState.Create));
                    History.push("/newTask");
                  }}
                >
                  Read
                </Button>
              </Flex>
            </Flex>
            {book._id && book.timesAdded && (
              <Flex
                direction="column"
                justifyContent={["center", "flex-start"]}
                alignItems={["center", "flex-start"]}
                flexGrow={1}
              >
                <Text as="i" fontSize="xs" color="yellow.500">
                  Created on{" "}
                  {new Date(
                    new ObjectId(book._id).getTimestamp()
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {"."}
                </Text>
                <Text as="i" fontSize="xs" color="yellow.500">
                  Added for {book.timesAdded}{" "}
                  {book.timesAdded === 1 ? "time." : "times."}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      ))}

      {isLoading && (
        <Container>
          <Spinner />
          Fetching books...
        </Container>
      )}
      {isError && <Container>Error. Please try again later</Container>}
    </Box>
  );
};

export default SearchResult;

import React, { FC, useState } from "react";
import { useForm } from "react-final-form";
//redux
import { AppDispatch } from "app/store";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthJwtToken } from "features/auth/authSlice";
import { setCurrentSelectedBook } from "features/search/searchSlice";
//uis
import {
  Box,
  BoxProps,
  Button,
  Image,
  AspectRatio,
  Flex,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import {
  getSdk,
  SearchBookInput,
  Search_BaseBook_All_Fragment,
} from "gql/generated/gql-types";
import SearchInput from "components/common/SearchBookInput";
import { GraphQLClient } from "graphql-request";
import {
  DEFAULT_ONLINE_BOOKS_PER_QUERY,
  MAX_TIME_TO_SEARCH_BOOKS,
  GQL_ENDPOINT,
} from "consts";

export interface ITaskChangeAttachItemProps extends BoxProps {
  handleClickSelect: React.Dispatch<React.SetStateAction<boolean>>;
}
const TaskChangeAttachItem: FC<ITaskChangeAttachItemProps> = ({
  handleClickSelect,
  ...rest
}) => {
  const dispatch: AppDispatch = useDispatch();
  const jwtToken = useSelector(selectAuthJwtToken);

  const form = useForm();

  const displayingFactor =
    useBreakpointValue({ base: 1 / 3, md: 1 / 2, lg: 1 }) || 1;

  const [searchValue, setSearchValue] = useState("");

  const [searchedBooks, setSearchedBooks] = useState<
    Search_BaseBook_All_Fragment[]
  >([]);
  const [displayingBooks, setDisplayingBooks] = useState<
    Search_BaseBook_All_Fragment[]
  >([]);
  const [searchPage, setSearchPage] = useState<number>(0);
  const [searchMaxPage, setSearchMaxPage] = useState<number>(
    MAX_TIME_TO_SEARCH_BOOKS
  );
  const searchLimit: Readonly<number> =
    DEFAULT_ONLINE_BOOKS_PER_QUERY * displayingFactor;
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchError, setIsSearcError] = useState<boolean>(false);

  const searchBook = async (args: {
    input: SearchBookInput;
    offset: number;
    limit: number;
  }) => {
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    const { searchOnlineBooks } = await sdk.searchOnlineBooks(args);
    return searchOnlineBooks;
  };

  const handleClick = async () => {
    //set page
    setSearchPage(1);

    //process value input
    const parts = searchValue.split("/");
    let input: SearchBookInput = {};
    if (parts[0]) {
      input.title = parts[0];
    }
    if (parts[1]) {
      input.author = parts[1];
    }
    //start loading
    setIsSearching(true);
    try {
      const books = await searchBook({
        input,
        offset: 0,
        limit: searchLimit,
      });

      //set books
      setDisplayingBooks(books.slice(0, searchLimit));
      setSearchedBooks(books);

      //set max page available
      if (books.length < searchLimit) {
        setSearchMaxPage(searchPage);
      } else {
        setSearchMaxPage(MAX_TIME_TO_SEARCH_BOOKS);
      }
    } catch (e) {
      console.log(e);
      setIsSearcError(true);
    }

    //stop loading
    setIsSearching(false);
  };

  const handleClickNext = async () => {
    //set page
    const nextPage = searchPage + 1;
    setSearchPage(nextPage);
    const totalPages = Math.ceil(searchedBooks.length / searchLimit);

    if (nextPage <= totalPages) {
      setDisplayingBooks(
        searchedBooks.slice(
          searchLimit * (nextPage - 1),
          searchLimit * nextPage
        )
      );
    } else {
      //process prev search inpiut
      const parts = searchValue ? searchValue.split("/") : [];
      let input: SearchBookInput = {};
      if (parts[0]) {
        input.title = parts[0];
      }
      if (parts[1]) {
        input.author = parts[1];
      }
      //start loading
      setIsSearching(true);

      try {
        const books = await searchBook({
          input: input,
          offset: searchedBooks.length,
          limit: searchLimit,
        });

        //set books
        setDisplayingBooks(books);
        const allBooks = searchedBooks.concat(books);
        setSearchedBooks(allBooks);

        //set max page available
        if (books.length < searchLimit) {
          setSearchMaxPage(nextPage);
        }
      } catch (e) {
        console.log(e);
        setIsSearcError(true);
      }

      //stop loading
      setIsSearching(false);
    }
  };

  const handleClickPrev = () => {
    if (searchPage === 1) {
      setDisplayingBooks(searchedBooks.slice(0, searchLimit));
    } else {
      const prevPage = searchPage - 1;
      //set page
      setSearchPage(prevPage);

      //set books
      setDisplayingBooks(
        searchedBooks.slice(
          searchLimit * (prevPage - 1),
          searchLimit * prevPage
        )
      );
    }
  };

  return (
    <Box {...rest}>
      <Flex direction="column" flexGrow={1} justifyContent="space-between">
        <Flex flexGrow={1} mb={[1, 1, 2]}>
          <SearchInput
            handleChangeValue={setSearchValue}
            handleClickSearch={handleClick}
            isSearching={isSearching}
            placeholder="Becoming/Michelle Obama"
          />
        </Flex>
        <Flex
          flexGrow={5}
          bg="yellow.50"
          display={searchPage !== 0 ? "flex" : "none"}
        >
          <Flex alignItems="center" flexGrow={1} justifyContent="center">
            <Button
              //styling
              size="xs"
              colorScheme="linkedin"
              //funcs
              onClick={handleClickPrev}
              isDisabled={searchPage <= 1}
            >
              <IoMdArrowDropleftCircle />
            </Button>
          </Flex>
          <Flex flexGrow={10} justifyContent="space-around" h={[180, 235]}>
            {isSearching && <Spinner alignSelf="center" color="blue.400" />}
            {!isSearchError &&
              !isSearching &&
              displayingBooks.map((b) => {
                return (
                  <Flex justifyContent="center" key={b.openLibraryId}>
                    <Flex
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <AspectRatio
                        ratio={2 / 3}
                        w={[90, 100, 110]}
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
                                  ? b.covers[0][1]
                                    ? b.covers[0][1]
                                    : undefined
                                  : undefined
                                : undefined
                              : undefined
                          }
                          fallbackSrc={`https://via.placeholder.com/200x300?text=${b.title}`}
                        />
                      </AspectRatio>
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
                          dispatch(setCurrentSelectedBook(b));
                          handleClickSelect(false);
                          form.change("openLibraryBookId", b.openLibraryId);
                        }}
                      >
                        Select
                      </Button>
                    </Flex>
                  </Flex>
                );
              })}
          </Flex>

          <Flex alignItems="center" flexGrow={1} justifyContent="center">
            <Button
              //styling
              size="xs"
              colorScheme="linkedin"
              //funcs
              onClick={handleClickNext}
              isDisabled={searchPage >= searchMaxPage}
            >
              <IoMdArrowDroprightCircle />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TaskChangeAttachItem;

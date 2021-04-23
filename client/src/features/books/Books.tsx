import React, { FC, useState, useEffect } from "react";
//redux
import { useDispatch } from "react-redux";
import {
  //actions
  initializeBooks,
} from "./booksSlice";

//uis
import { Flex, Box, Button } from "@chakra-ui/react";
import SearchBookInput from "components/common/SearchBookInput";
import FetchedBooks from "components/books/FetchedBooks";
import { BookFilter } from "gql/generated/gql-types";

const Books: FC = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    dispatch(initializeBooks({}));
  }, []);

  const handleClickSearch = () => {
    const filter: BookFilter = {};
    if (query) {
      const parts = query.split("/");
      if (parts[0]) {
        filter.title = parts[0];
      }
      if (parts[1]) {
        filter.author = parts[1];
      }
    }
    dispatch(initializeBooks({ filter }));
  };
  return (
    <Flex
      ml={[1, 1, 2]}
      flexGrow={1}
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Flex flexGrow={1} w={["100%", "40%"]} my={[2, 4]} direction="row">
        <SearchBookInput
          handleChangeValue={setQuery}
          handleClickSearch={handleClickSearch}
          isSearching={isSearching}
          placeholder="title/author"
        />
        <Button
          ml={[2, 4]}
          onClick={() => {
            dispatch(initializeBooks({}));
          }}
        >
          Reset
        </Button>
      </Flex>
      <Box flexGrow={10} w={"100%"}>
        <FetchedBooks handleChangeSearching={setIsSearching} />
      </Box>
    </Flex>
  );
};

export default Books;

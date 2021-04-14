import React, { FC } from "react";

import { Flex, Box } from "@chakra-ui/react";
import SearchBar from "components/search/SearchBar";
import SearchResult from "components/search/SearchResult";

const SearchBooks: FC = () => {
  return (
    <Flex
      ml={[1, 1, 2]}
      flexGrow={1}
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Box flexGrow={1} w={["100%", "60%"]} mb={[2, 4]}>
        <SearchBar />
      </Box>
      <Box flexGrow={10} w={["100%", "50%"]}>
        <SearchResult />
      </Box>
    </Flex>
  );
};

export default SearchBooks;

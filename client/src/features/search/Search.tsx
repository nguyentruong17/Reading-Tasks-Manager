import React, { FC } from "react";

import { Flex, Box, Text, Image } from "@chakra-ui/react";
import SearchBar from "components/search/SearchBar";
import SearchResult from "components/search/SearchResult";
import logo from "logo.png";

const SearchBooks: FC = () => {
  return (
    <Flex
      ml={[1, 1, 2]}
      flexGrow={1}
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Box
        flexGrow={1}
        w={["100%", "60%"]}
        mt={[4, 8]}
        mb={[3, 5]}
        textAlign="center"
      >
        <Flex flexGrow={1} alignItems="center" justifyContent="center" direction="column">
          <Image src={logo} maxWidth={[180, 220, 250]} mb={[3, 6]} />
          <Text color="gray.500" as="i">
            Powered by OpenLibrary API.
          </Text>
        </Flex>
      </Box>
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

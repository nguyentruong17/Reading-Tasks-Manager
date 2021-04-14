import React, { FC, useState, useEffect } from "react";
//redux
import { useDispatch } from "react-redux";
import {
  setCurrentOpenLibrarySearch,
  setCurrentUsersAddedSearch,
  setIsSearchingOpenLibrary,
} from "features/search/searchSlice";
import {
  Box,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  BoxProps,
} from "@chakra-ui/react";
import SearchInput from "components/common/SearchBookInput";

export interface ISearchBarProps extends BoxProps {}
const SearchBar: FC<ISearchBarProps> = ({ ...rest }) => {
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  useEffect(() => {
    if (tabIndex === 0) {
      dispatch(setIsSearchingOpenLibrary(true));
    } else {
      dispatch(setIsSearchingOpenLibrary(false));
    }
  }, [tabIndex]);

  const [openLibrarySearch, setOpenLibrarySearch] = useState<string>("");
  const [usersAddedSearch, setUsersAddedSearch] = useState<string>("");
  const onSearchOpenLibrary = () => {
    dispatch(setCurrentOpenLibrarySearch(openLibrarySearch));
  };
  const onSearchUsersAdded = () => {
    dispatch(setCurrentUsersAddedSearch(usersAddedSearch));
  };

  return (
    <Box {...rest}>
      <Tabs
        //stylings
        variant="enclosed-colored"
        outline="none"
        //funcs
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList>
          <Tab>OpenLibrary</Tab>
          <Tab>Users Added</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SearchInput
              handleChangeValue={setOpenLibrarySearch}
              handleClickSearch={onSearchOpenLibrary}
              placeholder="Becoming/Michelle Obama"
            />
          </TabPanel>
          <TabPanel>
            <SearchInput
              handleChangeValue={setUsersAddedSearch}
              handleClickSearch={onSearchUsersAdded}
              placeholder="Becoming/Michelle Obama"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SearchBar;

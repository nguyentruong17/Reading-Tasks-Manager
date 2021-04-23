import React, { FC, useState, Dispatch, SetStateAction } from "react";
import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Button,
  InputGroupProps,
} from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";

export interface ISearchInputProps extends InputGroupProps {
  handleChangeValue: Dispatch<SetStateAction<string>>,
  handleClickSearch?: Function,
  inputValidator?: () => boolean,
  placeholder?: string,
  isDisabledInput?: boolean,
  isSearching?: boolean
}
export const SearchInput: FC<ISearchInputProps> = ({
  handleChangeValue,
  handleClickSearch,
  inputValidator,
  placeholder,
  isDisabledInput,
  isSearching,
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  //const [prevSearchInput, setPrevSearchInput] = useState<null | string>(null);
  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
    handleChangeValue(event.target.value);
  };

  return (
    <InputGroup {...rest}>
      <InputLeftElement
        pointerEvents="none"
        children={<IoMdSearch color="gray.300" />}
      />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        isInvalid={inputValidator ? inputValidator() : false}
        isDisabled={isDisabledInput === undefined ? false : isDisabledInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
      <InputRightElement width="4.5rem" mr="0.5">
        <Button
          //styling
          h="1.75rem"
          size="sm"
          fontSize={["xs", "sm"]}
          colorScheme="green"
          //funcs
          isDisabled={
            (searchValue.length === 0 
              //|| searchValue === prevSearchInput
            )
          }
          isLoading={isSearching === undefined ? false : isSearching}
          onClick={() => {
            //setPrevSearchInput(searchValue);
            if (handleClickSearch) {
              handleClickSearch();
            }
          }}
        >
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;

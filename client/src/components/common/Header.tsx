import React, { MouseEventHandler, useState, FC } from "react";
//import styled, { StyledFunction } from "styled-components";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  logOut,
  //selectors
  selectAuthJwtToken,
} from "features/auth/authSlice";
import {
  setOperation,
  setCreateWithSelectedBook,
  OperationState,
} from "features/task/crudTaskSlice";
//history
import history from "utils/history";

//uis
import { Box, Text, Button, Flex, Stack, BoxProps } from "@chakra-ui/react";
import { IoMdAdd, IoMdPower, IoMdClose, IoMdMenu, IoMdSearch } from "react-icons/io";

//the FC Logo, MenuToggle, NavbarContainer are used from this tutorial:
//https://raptis.wtf/blog/create-a-navbar-with-chakra-ui-react/
interface ILogoProps {
  onClickHandler: MouseEventHandler<HTMLDivElement>;
}
const Logo: FC<ILogoProps & BoxProps> = ({
  onClickHandler,
  ...props
}): JSX.Element => {
  return (
    <Box {...props} onClick={onClickHandler}>
      <Text fontSize={["md", "lg"]} fontWeight="semibold" color="teal.600">
        Reading Task Manager
      </Text>
    </Box>
  );
};

interface IMenuToggleProps {
  toggle: MouseEventHandler<HTMLDivElement>;
  isOpen: boolean;
}
const MenuToggle: FC<IMenuToggleProps> = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <IoMdClose /> : <IoMdMenu />}
    </Box>
  );
};

interface IMenuItemProps {
  //itemName: string;
  onClickHandler: MouseEventHandler<HTMLButtonElement>;
}
const MenuItem: FC<IMenuItemProps> = ({ children, onClickHandler }) => {
  return (
    <Button colorScheme="teal" variant="outline" onClick={onClickHandler}>
      {children}
    </Button>
  );
};

interface INavBarContainerProps {
  //itemName: string;
}
const NavBarContainer: FC<INavBarContainerProps> = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={3}
      mb={2}
      bg="whiteAlpha.300"
      color="teal.600"
      boxShadow="sm"
      {...props}
    >
      {children}
    </Flex>
  );
};

interface IHeaderProps {
  defaultRoute: string;
}
const Header: FC<IHeaderProps> = (props: IHeaderProps) => {
  const dispatch = useDispatch();
  const jwtToken = useSelector(selectAuthJwtToken);

  const { defaultRoute } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const pushToNewTask = () => {
    dispatch(setCreateWithSelectedBook(false));
    dispatch(setOperation(OperationState.Create))
    history.push("/newTask")
  };

  const pushToSearch = () => history.push("/search");

  //const pushToSettings = () => history.push("/settings");

  const pushToDefaultRoute = () => history.push(defaultRoute);

  return (
    <NavBarContainer {...props}>
      <Logo
        style={{ cursor: "pointer" }}
        onClickHandler={pushToDefaultRoute}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />

      {jwtToken && (
        <Box
          display={{ base: isOpen ? "block" : "none", md: "block" }}
          flexBasis={{ base: "100%", md: "auto" }}
        >
          <Stack
            spacing={8}
            align="center"
            justify={["center", "space-between", "flex-end", "flex-end"]}
            direction={["column", "row", "row", "row"]}
            pt={[4, 4, 0, 0]}
          >
            <MenuItem onClickHandler={pushToSearch}>
              <IoMdSearch /> Search Book
            </MenuItem>
            <MenuItem onClickHandler={pushToNewTask}>
              <IoMdAdd /> New Task
            </MenuItem>
            <MenuItem onClickHandler={() => dispatch(logOut())}>
              <IoMdPower /> Log Out
            </MenuItem>
          </Stack>
        </Box>
      )}
    </NavBarContainer>
  );
};

export default Header;

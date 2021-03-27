import React, { MouseEventHandler, useState, FC } from "react";
//import styled, { StyledFunction } from "styled-components";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  logOut,
  //selectors
  selectAuthJwtToken,
} from "../../features/auth/authSlice";
//history
import history from "../../utils/history";

//uis
import { Box, Text, Button, Flex, Stack, BoxProps } from "@chakra-ui/react";
import {
  IoMdAdd,
  IoMdPower,
  IoMdClose,
  IoMdMenu,
} from "react-icons/io";

//the FC Logo, MenuToggle, NavbarContainer are used from this tutorial:
//https://raptis.wtf/blog/create-a-navbar-with-chakra-ui-react/
interface ILogoProps {
  onClickHandler: MouseEventHandler<HTMLDivElement>;
}
const Logo: FC<ILogoProps & BoxProps> = ({ onClickHandler, ...props }): JSX.Element => {
  return (
    <Box {...props} onClick={onClickHandler}>
      <Text fontSize="lg" fontWeight="bold">
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
  return <Button onClick={onClickHandler}>{children}</Button>;
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
      mb={8}
      p={8}
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

interface IHeaderProps {
  defaultRoute: string;
}
const Header = (props: IHeaderProps) => {
  const dispatch = useDispatch();
  const jwtToken = useSelector(selectAuthJwtToken);
  //console.log(jwtToken);

  const { defaultRoute } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const pushToNewTask = () => history.push("/newTask");

  //const pushToSettings = () => history.push("/settings");

  const pushToDefaultRoute = () => history.push(defaultRoute);

  return (
    <NavBarContainer {...props}>
      <Logo
        color={["white", "white", "primary.500", "primary.500"]}
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
            <MenuItem onClickHandler={pushToNewTask}>
              <IoMdAdd className="mr-2" />
              New Incident
            </MenuItem>
            <MenuItem onClickHandler={() => dispatch(logOut())}>
              <IoMdPower className="mr-2" />
              Log Out
            </MenuItem>
          </Stack>
        </Box>
      )}
    </NavBarContainer>
  );
};

export default Header;

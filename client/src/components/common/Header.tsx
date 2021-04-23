import React, { MouseEventHandler, useState, FC } from "react";
import jwt_decode, { JwtPayload } from "jwt-decode";

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
import {
  Box,
  Text,
  Button,
  Flex,
  Stack,
  BoxProps,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  IoMdAdd,
  IoMdPower,
  IoMdClose,
  IoMdMenu,
  IoMdSearch,
  IoMdArrowDropdown,
  IoMdBook,
  IoMdList,
} from "react-icons/io";
import logo from "logo.png";

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
    <Flex
      {...props}
      onClick={onClickHandler}
      direction="row"
      alignItems="center"
    >
      <Image src={logo} maxW={35} mr={[1, 2, 3]} />

      <Text fontSize={["md", "lg"]} fontWeight="semibold" color="green.700">
        Reading Task Manager
      </Text>
    </Flex>
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
const CustomMenuItem: FC<IMenuItemProps> = ({ children, onClickHandler }) => {
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

export interface IJwtPayload extends JwtPayload {
  user: {
    _id: string;
    gmail: string;
    googleId: string;
    firstName: string;
    lastName: string;
  };
}

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
    dispatch(setOperation(OperationState.Create));
    history.push("/newTask");
  };

  const pushToSearch = () => history.push("/search");

  //const pushToSettings = () => history.push("/settings");

  const pushToDefaultRoute = () => history.push(defaultRoute);

  const pushToTasks = () => history.push("/tasks");

  const pushToBooks = () => history.push("/books");

  return (
    <NavBarContainer {...props}>
      <Logo style={{ cursor: "pointer" }} onClickHandler={pushToDefaultRoute} />
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
            <CustomMenuItem onClickHandler={pushToSearch}>
              <IoMdSearch />
              <Text ml={2} fontSize={["xs", "sm"]}>
                Search Book
              </Text>
            </CustomMenuItem>
            <CustomMenuItem onClickHandler={pushToNewTask}>
              <IoMdAdd />
              <Text ml={2} fontSize={["xs", "sm"]}>
                New Task
              </Text>
            </CustomMenuItem>
            <Menu>
              <MenuButton
                colorScheme="teal"
                as={Button}
                rightIcon={<IoMdArrowDropdown />}
                //variant="outline"
              >
                <Text ml={2} fontSize={["xs", "sm"]}>
                  {jwt_decode<IJwtPayload>(jwtToken)["user"]["firstName"] || "Actions"}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={pushToTasks}>
                  <IoMdList />
                  <Text ml={2}>My tasks</Text>
                </MenuItem>
                <MenuItem onClick={pushToBooks}>
                  <IoMdBook />
                  <Text ml={2}>My books</Text>
                </MenuItem>
                <MenuItem onClick={() => dispatch(logOut())}>
                  <IoMdPower />
                  <Text ml={2}>Log out</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Box>
      )}
    </NavBarContainer>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

//redux
import { useSelector } from "react-redux";
import {
  //selectors
  selectAuthLoading,
  selectAuthJwtToken,
} from "features/auth/authSlice";

//uis
import { Flex, Spinner, Container } from "@chakra-ui/react";
import Header from "components/common/Header";
import { Auth } from "features/auth/Auth";
import ViewTasks from "features/tasks/Tasks";
import ViewTask from "features/task/Task";

const routes = [
  {
    component: ViewTask,
    path: "/tasks/:taskId",
  },
  {
    component: ViewTasks,
    path: "/tasks",
  },
  {
    component: ViewTask,
    path: "/newTask",
  },
  // {
  //   component: null,
  //   path: '/books',
  // },
  // {
  //   component: null,
  //   path: '/books:bookId',
  // },
  // {
  //   component: null,
  //   path: '/myProfile',
  // },
];

const App = () => {
  const jwtToken = useSelector(selectAuthJwtToken);
  const authorizing = useSelector(selectAuthLoading);
  const defaultRoute = jwtToken ? "/tasks" : "/";

  //const [appLoading, setAppLoading] = useState(false);

  // useEffect(() => {
  //   const initializeAsync = async () => {
  //     setAppLoading(true);

  //     //fetch Misc
  //     //await dispatch(fetchTasks());

  //     setAppLoading(false);
  //   };

  //   if (jwtToken) {
  //     initializeAsync();
  //   }
  // }, [jwtToken]);

  if (authorizing) {
    return (
      <Container className="mh-100">
        <div className="mh-100 justify-content-center align-items-center text-center">
          <Spinner />
          <p style={{ paddingLeft: "20px" }}>Fetching Your Reading Tasks...</p>
        </div>
      </Container>
    );
  }

  return (
    <Flex fontSize={["xs", "sm", "sm", "md"]} direction="column">
      <Header defaultRoute={defaultRoute} />
      <Flex w="100%">
        <Switch>
          {jwtToken ? (
            routes.map((route) => (
              <Route key={route.path} path={route.path}>
                <route.component />
              </Route>
            ))
          ) : (
            <Route exact path="/">
              <Auth />
            </Route>
          )}
          <Redirect to={defaultRoute} />
        </Switch>
      </Flex>
    </Flex>
  );
};

export default App;

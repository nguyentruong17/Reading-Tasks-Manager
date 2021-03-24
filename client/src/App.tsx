import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //selectors
  selectAuthJwtToken,
} from "./features/auth/authSlice";

//uis
import { Container, Spinner } from "@chakra-ui/react";
import Header from "./components/common/Header";
import { Auth } from "./features/auth/Auth";
import { Counter } from "./features/counter/Counter";

const routes = [
  {
    component: Counter,
    path: "/tasks",
  },
  // {
  //   component: null,
  //   path: '/tasks/:taskId',
  // },
  // {
  //   component: null,
  //   path: '/newTask',
  // },
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
  const dispatch = useDispatch();
  const jwtToken = useSelector(selectAuthJwtToken);

  const [appLoading, setAppLoading] = useState(false);
  const defaultRoute = jwtToken ? "/tasks" : "/";

  useEffect(() => {
    const initializeAsync = async () => {
      setAppLoading(true);

      //fetch Misc
      //await dispatch(fetchTasks());

      setAppLoading(false);
    };

    if (jwtToken) {
      initializeAsync();
    }
  }, [jwtToken]);

  if (appLoading) {
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
    <div>
      <Header defaultRoute={defaultRoute} />
      <Container>
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
      </Container>
    </div>
  );
};

export default App;

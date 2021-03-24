import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import {
  //actions
  clickLogin,
  loginBackend,

  //selectors,
  selectJustClickedLogin,
} from "./authSlice";

import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

import { Button } from '@chakra-ui/react';

export function Auth() {
  const justClickedLogin = useSelector(selectJustClickedLogin);
  const dispatch = useDispatch();

  const initialTokenId = "initialTokenId";
  const [tokenId, setTokenId] = useState(initialTokenId);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (justClickedLogin && tokenId !== initialTokenId) {
      //console.log('Here')
      dispatch(loginBackend(tokenId));
    }
  }, [tokenId]);

  const handleOnClick = () => {
    dispatch(clickLogin())
  }

  const handleSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ("tokenId" in response) {
      setTokenId(response.tokenId);
    }
  };

  const handleFailure = (response: any) => {
    console.log(response);
    setIsError(true);
  };

  return (
    <div onClick={handleOnClick}>
      <GoogleLogin
        clientId="496969872954-9si2o01oedof7tngpijp7947ujlnp17s.apps.googleusercontent.com"
        buttonText="Login"
        uxMode="redirect"
        redirectUri="http://localhost:4200"
        isSignedIn
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={"single_host_origin"}
      />
      {isError && (
        <div>Error logging in with Google. Please try again later.</div>
      )}
    </div>
  );
}

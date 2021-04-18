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

//uis
import { Flex, Image, Text, Container, AspectRatio } from "@chakra-ui/react";
import { IoMdHeart } from "react-icons/io";
import logo from "logo.png";

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
    dispatch(clickLogin());
  };

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
    <Flex direction="row" h="90vh" flexGrow={1}>
      <Flex display={["none", "flex"]} flexGrow={3}>
        <AspectRatio w="100%" maxH="100%" ratio={4 / 3}>
          <Image src={"https://i.imgur.com/HNhjpEF.jpg"} />
        </AspectRatio>
      </Flex>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <Flex direction="column" alignItems="center" mb={10}>
          <Image src={logo} maxW={200} mr={[1, 2, 3]} mb={5} />
          <Text fontSize={["lg", "xl"]} fontWeight="bold" color="green.700">
            Welcome!
          </Text>
        </Flex>
        <Flex>
          <Container onClick={handleOnClick} px={0}>
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
          </Container>

          {isError && (
            <Container>
              Error logging in with Google. Please try again later.
            </Container>
          )}
        </Flex>
        <Flex direction="column" position="absolute" bottom={0}>
          <Flex direction="row">
            <Text mr={1} fontSize="xs">Created from OlinLab, Augustana College with</Text>
            <IoMdHeart color="red" />            
          </Flex>
          <Text fontSize="xs" textAlign="center">
            coded by nguyentruong17
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

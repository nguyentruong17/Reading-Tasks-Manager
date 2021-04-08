//redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import { getSdk } from "gql/generated/gql-types";
import { GQL_ENDPOINT } from "consts"

interface AuthState {
  justClickedLogin: boolean;
  jwtToken: string;
  loading: boolean;
  error: {
    message: string;
    code: string;
  };
}

const initialState: AuthState = {
  justClickedLogin: false,
  jwtToken: "",
  loading: false,
  error: {
    message: "",
    code: "-1",
  },
};

export const loginBackend = createAsyncThunk(
  "auth/loginBackend",
  async (googleIdToken: string) => {
    const client = new GraphQLClient(GQL_ENDPOINT);
    const sdk = getSdk(client);
    const variables = {
      idToken: googleIdToken,
    };
    const { login } = await sdk.login(variables);
    //console.log(login)
    return login;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    clickLogin: (state) => {
      state.justClickedLogin = true;
    },
    logOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginBackend.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginBackend.fulfilled, (state, action) => {
        state.jwtToken = action.payload;
        state.loading = false;
        state.error = {
          message: "",
          code: "-1",
        };
      })
      .addCase(loginBackend.rejected, (state, action) => {
        state.jwtToken = "";
        state.loading = false;
        state.error = {
          message:
            `${action.error.name || "Error: "}: ${action.error.message}` ||
            `${
              action.error.name || "Error: "
            }: Failed to login with graphql server`,
          code: action.error.code || "500",
        };
        state.justClickedLogin = false;
      });
  },
});

export const { reset, logOut, clickLogin } = authSlice.actions;

export const selectJustClickedLogin = (state: RootState) =>
  state.auth.justClickedLogin;
export const selectAuthJwtToken = (state: RootState) => state.auth.jwtToken;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

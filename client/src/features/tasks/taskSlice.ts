//redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import { getSdk, BaseTaskMongo, Task } from "../../gql/generated/gql-types";
const GQL_ENDPOINT = "http://localhost:3000/graphql";

interface AuthState {
  tasks: BaseTaskMongo[];
  task_by_id: Task | null;
  loading: boolean;
  error: {
    message: string;
    code: string;
  };
}

const initialState: AuthState = {
  tasks: [],
  task_by_id: null,
  loading: false,
  error: {
    message: "",
    code: "-1",
  },
};

export const getTasks = createAsyncThunk("tasks/getTasks", async (_, { getState }) => {

  const { auth } = getState() as { auth: { jwtToken: string } };
  console.log(auth.jwtToken)
  const client = new GraphQLClient(GQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${auth.jwtToken}`,
    },
  });
  const sdk = getSdk(client);

  const { getTasks } = await sdk.getTasks();
  //console.log(login)
  return getTasks;
});

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message:
            `${action.error.name || "Error: "}: ${action.error.message}` ||
            `${
              action.error.name || "Error: "
            }: Failed to login with graphql server`,
          code: action.error.code || "500",
        };
      });
  },
});

export const {} = taskSlice.actions;

export const selectAllTasks = (state: RootState) => state.task.tasks;
export const selectTaskById = (state: RootState) => state.task.task_by_id;
export const selectTaskLoading = (state: RootState) => state.task.loading;
export const selectTaskError = (state: RootState) => state.task.error;

export default taskSlice.reducer;

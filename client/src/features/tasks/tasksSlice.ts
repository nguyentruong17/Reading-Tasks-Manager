//redux
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import {
  getSdk,
  GetTasksQueryVariables,
  ViewTasks_UserTask_All_Fragment,
} from "../../gql/generated/gql-types";

import { GQL_ENDPOINT, DEFAULT_USER_TASKS_PER_QUERY } from "../../consts";

interface AuthState {
  tasks: ViewTasks_UserTask_All_Fragment[];
  loading: boolean;
  error: {
    message: string;
    code: string;
  };
  pagination: {
    count: number;
    limit: number;
    startCursor: string;
    endCursor: string;
  };
}

const initialState: AuthState = {
  tasks: [],
  loading: false,
  error: {
    message: "",
    code: "-1",
  },
  pagination: {
    count: 0,
    limit: DEFAULT_USER_TASKS_PER_QUERY,
    startCursor: "",
    endCursor: "",
  },
};

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (args: GetTasksQueryVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    //console.log(auth.jwtToken);
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${auth.jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    let { first, last, ...rest } = args;
    if (!first && !last) {
      first = DEFAULT_USER_TASKS_PER_QUERY;
    }
    const { getTasks } = await sdk.getTasks({
      first,
      ...rest,
    });
    return getTasks;
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setPaginationCount: (state, action: PayloadAction<number>) => {
      state.pagination.count = action.payload;
    },
    setPaginationLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        const tasks: ViewTasks_UserTask_All_Fragment[] = [];
        if (action.payload.page.edges) {
          action.payload.page.edges.forEach((e) => {
            if (e && e.node) {
              tasks.push(e.node);
            }
          });
        }

        state.tasks = tasks;
        state.loading = false;

        if (action.payload.page.pageInfo) {
          if (action.payload.page.pageInfo.startCursor) {
            state.pagination = {
              ...state.pagination,
              startCursor: action.payload.page.pageInfo.startCursor,
            };
          }

          if (action.payload.page.pageInfo.endCursor) {
            state.pagination = {
              ...state.pagination,
              endCursor: action.payload.page.pageInfo.endCursor,
            };
          }
        }
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

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksPagination = (state: RootState) => state.tasks.pagination; 

export default taskSlice.reducer;

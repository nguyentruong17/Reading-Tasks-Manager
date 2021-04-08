//redux
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import {
  getSdk,
  GetTaskQueryVariables,
  UpdateTaskMutationVariables,
  ViewTask_Task_Parts_Fragment,
  ViewTask_TaskHistory_All_Fragment,
} from "gql/generated/gql-types";

import { GQL_ENDPOINT, DEFAULT_TASK_HISTORY_PER_REQUEST } from "consts";

interface TaskState {
  task: ViewTask_Task_Parts_Fragment | null;
  loading: boolean;
  error: {
    message: string;
    code: string;
  };
  history: {
    data: ViewTask_TaskHistory_All_Fragment[];
    pagination: {
      count: number;
      limit: number;
      startCursor: string;
      endCursor: string;
    };
  };
}

const initialState: TaskState = {
  task: null,
  loading: false,
  error: {
    message: "",
    code: "-1",
  },
  history: {
    data: [],
    pagination: {
      count: 0,
      limit: DEFAULT_TASK_HISTORY_PER_REQUEST,
      startCursor: "",
      endCursor: "",
    },
  },
};

const fetchTask = async (args: GetTaskQueryVariables, jwtToken: string) => {
  const client = new GraphQLClient(GQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${jwtToken}`,
    },
  });
  const sdk = getSdk(client);
  let { first, last, ...rest } = args;
  if (!first && !last) {
    first = DEFAULT_TASK_HISTORY_PER_REQUEST;
  }
  const { getTask } = await sdk.getTask({
    first,
    ...rest,
  });
  return getTask;
};

const fetchTaskHistory = async (
  args: GetTaskQueryVariables,
  jwtToken: string
) => {
  const client = new GraphQLClient(GQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${jwtToken}`,
    },
  });
  const sdk = getSdk(client);
  let { first, last, ...rest } = args;
  if (!first && !last) {
    first = DEFAULT_TASK_HISTORY_PER_REQUEST;
  }
  const { getTask } = await sdk.getTaskHistory({
    first,
    ...rest,
  });
  return getTask;
};

export const initializeTask = createAsyncThunk(
  "task/initializeTask",
  async (args: GetTaskQueryVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };

    return await fetchTask(args, auth.jwtToken);
  }
);

export const loadNextHistory = createAsyncThunk(
  "task/loadMoreHistory",
  async (
    args: Omit<GetTaskQueryVariables, "after" | "last" | "before">,
    { getState }
  ) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    const { task } = getState() as {
      task: { history: { pagination: { endCursor: string } } };
    };
    return await fetchTaskHistory(
      {
        ...args,
        after: task.history.pagination.endCursor,
      },
      auth.jwtToken
    );
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (args: UpdateTaskMutationVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };

    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${auth.jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    const { updateTask } = await sdk.updateTask(args)
    return updateTask;
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setHistoryPaginationCount: (state, action: PayloadAction<number>) => {
      state.history.pagination.count = action.payload;
    },
    setHistoryPaginationLimit: (state, action: PayloadAction<number>) => {
      state.history.pagination.limit = action.payload;
    },
    setHistoryPaginationStartCursor: (state, action: PayloadAction<string>) => {
      state.history.pagination.startCursor = action.payload;
    },
    setHistoryPaginationEndCursor: (state, action: PayloadAction<string>) => {
      state.history.pagination.endCursor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //load initial
      .addCase(initializeTask.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(initializeTask.fulfilled, (state, action) => {
        const { history, ...task } = action.payload;

        //task
        state.task = task;

        //history
        ////data
        if (history.page.edges) {
          const data: ViewTask_TaskHistory_All_Fragment[] = [];
          history.page.edges.forEach((e) => {
            if (e && e.node) {
              data.push(e.node);
            }
          });
          state.history.data = data;
        }
        ////pagination
        if (history.page.pageInfo) {
          const { endCursor, startCursor } = history.page.pageInfo;
          if (startCursor) {
            state.history.pagination = {
              ...state.history.pagination,
              startCursor,
            };
          }

          if (endCursor) {
            state.history.pagination = {
              ...state.history.pagination,
              endCursor,
            };
          }
        }
        if (history.pageData) {
          const { count } = history.pageData;
          state.history.pagination = {
            ...state.history.pagination,
            count,
          };
        }

        //stop loading
        state.loading = false;
      })
      .addCase(initializeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message:
            `${action.error.name || "Error: "}: ${action.error.message}` ||
            `${
              action.error.name || "Error: "
            }: Failed to login with graphql server`,
          code: action.error.code || "500",
        };
      })

      // load next history
      .addCase(loadNextHistory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNextHistory.fulfilled, (state, action) => {
        const { history } = action.payload;
        //history
        ////data
        if (history.page.edges) {
          const data: ViewTask_TaskHistory_All_Fragment[] = [];
          history.page.edges.forEach((e) => {
            if (e && e.node) {
              data.push(e.node);
            }
          });
          state.history.data = data;
        }
        ////pagination
        if (history.page.pageInfo) {
          const { endCursor, startCursor } = history.page.pageInfo;
          if (startCursor) {
            state.history.pagination = {
              ...state.history.pagination,
              startCursor,
            };
          }

          if (endCursor) {
            state.history.pagination = {
              ...state.history.pagination,
              endCursor,
            };
          }
        }
        if (history.pageData) {
          const { count } = history.pageData;
          state.history.pagination = {
            ...state.history.pagination,
            count,
          };
        }
        //stop loading
        state.loading = false;
      })
      .addCase(loadNextHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message:
            `${action.error.name || "Error: "}: ${action.error.message}` ||
            `${
              action.error.name || "Error: "
            }: Failed to login with graphql server`,
          code: action.error.code || "500",
        };
      })

      //update task
      .addCase(updateTask.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { ...task } = action.payload;
        state.task = task;

        //stop loading
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message:
            `${action.error.name || "Error: "}: ${action.error.message}` ||
            `${
              action.error.name || "Error: "
            }: Failed to login with graphql server`,
          code: action.error.code || "500",
        };
      })
  },
});

export const {
  setHistoryPaginationCount,
  setHistoryPaginationLimit,
  setHistoryPaginationStartCursor,
  setHistoryPaginationEndCursor,
} = taskSlice.actions;

export const selectTask = (state: RootState) => state.task.task;
export const selectTaskLoading = (state: RootState) => state.task.loading;
export const selectTaskError = (state: RootState) => state.task.error;
export const selectTaskHistoryData = (state: RootState) =>
  state.task.history.data;
export const selectTaskHistoryPagination = (state: RootState) =>
  state.task.history.pagination;

export default taskSlice.reducer;

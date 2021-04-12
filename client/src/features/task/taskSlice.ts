//redux
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import {
  getSdk,
  GetTaskQueryVariables,
  UpdateTaskMutationVariables,
  CreateTaskMutationVariables,
  ViewTask_Task_Parts_Fragment,
  ViewTask_TaskHistory_All_Fragment,
  ViewTask_AttachItem_Parts_Fragment,
} from "gql/generated/gql-types";

import { GQL_ENDPOINT, DEFAULT_TASK_HISTORY_PER_REQUEST } from "consts";

interface TaskState {
  task: ViewTask_Task_Parts_Fragment | null;
  loading: boolean;
  error: {
    message: string;
    code: string;
  };
  attachItem: {
    data: ViewTask_AttachItem_Parts_Fragment | null;
    loading: boolean;
    error: {
      message: string;
      code: string;
    };
  };
  history: {
    data: ViewTask_TaskHistory_All_Fragment[];
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
  };
}

const initialState: TaskState = {
  task: null,
  loading: false,
  error: {
    message: "",
    code: "-1",
  },
  attachItem: {
    data: null,
    loading: false,
    error: {
      message: "",
      code: "-1",
    },
  },
  history: {
    data: [],
    loading: false,
    error: {
      message: "",
      code: "-1",
    },
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
    const { updateTask } = await sdk.updateTask(args);
    return updateTask;
  }
);

export const changeAttachItem = createAsyncThunk(
  "task/changeAttachItem",
  async (args: UpdateTaskMutationVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };

    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${auth.jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    args = {
      ...args,
      input: {
        openLibraryBookId: args.input.openLibraryBookId,
        bookId: args.input.bookId,
      },
    };
    const { updateTask: changeAttachItem } = await sdk.changeAttachItem(args);
    return changeAttachItem;
  }
);

export const updateTaskAndChangeAttachItem = createAsyncThunk(
  "task/updateTaskAndChangeAttachItem",
  async (args: UpdateTaskMutationVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    const client = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${auth.jwtToken}`,
      },
    });
    const sdk = getSdk(client);
    const {
      updateTask: updateTaskAndChangeItem,
    } = await sdk.updateTaskAndChangeAttachItem(args);
    return updateTaskAndChangeItem;
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
        state.attachItem.loading = true;
        state.history.loading = true;
      })
      .addCase(initializeTask.fulfilled, (state, action) => {
        const { attachItem, history, ...task } = action.payload;

        //task
        state.task = task;

        //attachItem
        state.attachItem.data = attachItem;

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
        state.attachItem.loading = false;
        state.history.loading = false;
        state.loading = false;
      })
      .addCase(initializeTask.rejected, (state, action) => {
        state.attachItem.loading = false;
        state.history.loading = false;
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
        state.history.loading = true;
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
        state.history.loading = false;
      })
      .addCase(loadNextHistory.rejected, (state, action) => {
        state.history.loading = false;
        state.history.error = {
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

      //change book
      .addCase(changeAttachItem.pending, (state, action) => {
        state.attachItem.loading = true;
      })
      .addCase(changeAttachItem.fulfilled, (state, action) => {
        const { attachItem } = action.payload;

        //attachItem
        state.attachItem.data = attachItem;

        //stop loading
        state.attachItem.loading = false;
      })
      .addCase(changeAttachItem.rejected, (state, action) => {
        state.attachItem.loading = false;
        state.error = {
          message:
            `${action.error.name || "Error: "}: ${action.error.message}` ||
            `${
              action.error.name || "Error: "
            }: Failed to login with graphql server`,
          code: action.error.code || "500",
        };
      })

      //update task && change book
      .addCase(updateTaskAndChangeAttachItem.pending, (state, action) => {
        state.loading = true;
        state.attachItem.loading = true;
      })
      .addCase(updateTaskAndChangeAttachItem.fulfilled, (state, action) => {
        const { attachItem, ...task } = action.payload;
        //task
        state.task = task;

        //attachItem
        state.attachItem.data = attachItem;

        //stop loading
        state.loading = false;
        state.attachItem.loading = false;
      })
      .addCase(updateTaskAndChangeAttachItem.rejected, (state, action) => {
        state.loading = false;
        state.attachItem.loading = false;
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

//task selectors
export const selectTask = (state: RootState) => state.task.task;
export const selectTaskLoading = (state: RootState) => state.task.loading;
export const selectTaskError = (state: RootState) => state.task.error;

//attachItem selectors
export const selectAttachItem = (state: RootState) =>
  state.task.attachItem.data;
export const selectAttachItemLoading = (state: RootState) =>
  state.task.attachItem.loading;
export const selectAttachItemError = (state: RootState) =>
  state.task.attachItem.error;

//history selectors:
export const selectTaskHistory = (state: RootState) => state.task.history.data;
export const selectTaskHistoryLoading = (state: RootState) =>
  state.task.history.loading;
export const selectTaskHistoryPagination = (state: RootState) =>
  state.task.history.pagination;
export const selectTaskHistoryError = (state: RootState) =>
  state.task.history.error;

export default taskSlice.reducer;

//redux
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import {
  getSdk,
  GetTasksQueryVariables,
  UserTaskFilter,
  ViewTasks_UserTask_All_Fragment,
} from "gql/generated/gql-types";

import { GQL_ENDPOINT, DEFAULT_USER_TASKS_PER_QUERY } from "consts";

interface TasksState {
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
    filter: UserTaskFilter;
  };
}

const initialState: TasksState = {
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
    filter: {}
  },
};

const fetchTasks = async (args: GetTasksQueryVariables, jwtToken: string) => {
  const client = new GraphQLClient(GQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${jwtToken}`,
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
};


let TEMP_FILTER: UserTaskFilter = { }
export const initializeTasks = createAsyncThunk(
  "tasks/initializeTasks",
  async (args: GetTasksQueryVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    if(args.filter) {
      TEMP_FILTER = args.filter;
    }
    return await fetchTasks(args, auth.jwtToken)
  }
);

export const loadNextTasks = createAsyncThunk(
  "tasks/loadMoreTasks",
  async (args: Omit<GetTasksQueryVariables, 'after' |'last' | 'before'>, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    const { tasks } = getState() as { tasks: { pagination : { endCursor: string, filter: UserTaskFilter }} };
    return await fetchTasks({
      ...args,
      after: tasks.pagination.endCursor,
      filter: tasks.pagination.filter
    }, auth.jwtToken);
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setPaginationCount: (state, action: PayloadAction<number>) => {
      state.pagination.count = action.payload;
    },
    setPaginationLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    setPaginationStartCursor: (state, action: PayloadAction<string>) => {
      state.pagination.startCursor = action.payload;
    },
    setPaginationEndCursor: (state, action: PayloadAction<string>) => {
      state.pagination.endCursor = action.payload;
    },
    setPaginationFilter: (state, action: PayloadAction<UserTaskFilter>) => {
      state.pagination.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //load initial
      .addCase(initializeTasks.pending, (state, action) => {
        state.loading = true;
        state.pagination = {
          ...state.pagination,
          filter: TEMP_FILTER
        }
      })
      .addCase(initializeTasks.fulfilled, (state, action) => {
        const tasks: ViewTasks_UserTask_All_Fragment[] = [];
        if (action.payload.page.edges) {
          action.payload.page.edges.forEach((e) => {
            if (e && e.node) {
              tasks.push(e.node);
            }
          });
        }

        //tasks
        state.tasks = tasks;
        
        //pagination
        if (action.payload.page.pageInfo) {
          const { endCursor, startCursor } = action.payload.page.pageInfo
          if (startCursor) {
            state.pagination = {
              ...state.pagination,
              startCursor,
            };
          }

          if (endCursor) {
            state.pagination = {
              ...state.pagination,
              endCursor
            };
          }
        }

        if (action.payload.pageData) {
          const { count } = action.payload.pageData;
          state.pagination = {
            ...state.pagination,
            count
          };
        }

        //stop loading
        state.loading = false;

      })
      .addCase(initializeTasks.rejected, (state, action) => {
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

      // load next 
      .addCase(loadNextTasks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNextTasks.fulfilled, (state, action) => {
        const tasks: ViewTasks_UserTask_All_Fragment[] = [...state.tasks];
        if (action.payload.page.edges) {
          action.payload.page.edges.forEach((e) => {
            if (e && e.node) {
              tasks.push(e.node);
            }
          });
        }

        //tasks
        state.tasks = tasks;

        //pagination
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

        //stop loading
        state.loading = false;
      })
      .addCase(loadNextTasks.rejected, (state, action) => {
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

export const { 
  setPaginationCount,
  setPaginationLimit,
  setPaginationStartCursor,
  setPaginationEndCursor,
  setPaginationFilter,
} = tasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksPagination = (state: RootState) =>
  state.tasks.pagination;

export default tasksSlice.reducer;

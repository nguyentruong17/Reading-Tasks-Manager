//redux
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import { GraphQLClient } from "graphql-request";
import {
  getSdk,
  GetBooksQueryVariables,
  BookFilter,
  ViewBooks_BaseBookMongo_Parts_Fragment,
} from "gql/generated/gql-types";

import { GQL_ENDPOINT, DEFAULT_BOOKS_PER_REQUEST } from "consts";

interface TasksState {
  books: ViewBooks_BaseBookMongo_Parts_Fragment[];
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
    filter: BookFilter;
  };
}

const initialState: TasksState = {
  books: [],
  loading: false,
  error: {
    message: "",
    code: "-1",
  },
  pagination: {
    count: 0,
    limit: DEFAULT_BOOKS_PER_REQUEST,
    startCursor: "",
    endCursor: "",
    filter: {}
  },
};

const fetchBooks = async (args: GetBooksQueryVariables, jwtToken: string) => {
  const client = new GraphQLClient(GQL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${jwtToken}`,
    },
  });
  const sdk = getSdk(client);
    let { first, after, filter } = args;
    if (!first) {
      first = DEFAULT_BOOKS_PER_REQUEST;
    }
    const { getBooks } = await sdk.getBooks({
      first,
      after,
      filter,
    });
    return getBooks;
};


let TEMP_FILTER: BookFilter = { }
export const initializeBooks = createAsyncThunk(
  "books/initializeBooks",
  async (args: GetBooksQueryVariables, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    if(args.filter) {
      TEMP_FILTER = args.filter;
    }
    return await fetchBooks(args, auth.jwtToken)
  }
);

export const loadNextBooks = createAsyncThunk(
  "books/loadMoreBooks",
  async (args: Omit<GetBooksQueryVariables, 'after' |'last' | 'before'>, { getState }) => {
    const { auth } = getState() as { auth: { jwtToken: string } };
    const { tasks } = getState() as { tasks: { pagination : { endCursor: string, filter: BookFilter }} };
    return await fetchBooks({
      ...args,
      after: tasks.pagination.endCursor,
      filter: tasks.pagination.filter
    }, auth.jwtToken);
  }
);

export const booksSlice = createSlice({
  name: "books",
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
    setPaginationFilter: (state, action: PayloadAction<BookFilter>) => {
      state.pagination.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //load initial
      .addCase(initializeBooks.pending, (state, action) => {
        state.loading = true;
        state.pagination = {
          ...state.pagination,
          filter: TEMP_FILTER
        }
      })
      .addCase(initializeBooks.fulfilled, (state, action) => {
        const books: ViewBooks_BaseBookMongo_Parts_Fragment[] = [];
        if (action.payload.page.edges) {
          action.payload.page.edges.forEach((e) => {
            if (e && e.node) {
              books.push(e.node);
            }
          });
        }

        //tasks
        state.books = books;
        
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
      .addCase(initializeBooks.rejected, (state, action) => {
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
      .addCase(loadNextBooks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadNextBooks.fulfilled, (state, action) => {
        const books: ViewBooks_BaseBookMongo_Parts_Fragment[] = [...state.books];
        if (action.payload.page.edges) {
          action.payload.page.edges.forEach((e) => {
            if (e && e.node) {
              books.push(e.node);
            }
          });
        }

        //tasks
        state.books = books;

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
      .addCase(loadNextBooks.rejected, (state, action) => {
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
} = booksSlice.actions;

export const selectBooks = (state: RootState) => state.books.books;
export const selectBooksLoading = (state: RootState) => state.books.loading;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBooksPagination = (state: RootState) =>
  state.books.pagination;

export default booksSlice.reducer;
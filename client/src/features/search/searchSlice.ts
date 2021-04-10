import ObjectId from "bson-objectid";
//redux
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import {
  Search_BaseBook_All_Fragment,
} from "gql/generated/gql-types";


export interface SelectedBook extends Search_BaseBook_All_Fragment {
  bookId?: ObjectId;
}

interface SearchState {
  // openLibraryBooks: {
  //   data: Search_BaseBook_Parts_Fragment[];
  //   offset: number;
  //   limit: number;
  //   searchInput: SearchBookInput | null;
  //   loading: boolean;
  //   error: {
  //     message: string;
  //     code: string;
  //   };
  // };
  currentSelectedBook: SelectedBook | null;
}

const initialState: SearchState = {
  // openLibraryBooks: {
  //   data: [],
  //   offset: 0,
  //   limit: DEFAULT_ONLINE_BOOKS_PER_QUERY,
  //   searchInput: null,
  //   loading: false,
  //   error: {
  //     message: "",
  //     code: "-1",
  //   },
  // },
  currentSelectedBook: null,
};

// const searchOnlineBooks = async (
//   args: {
//     input: SearchBookInput;
//     offset: number;
//     limit: number;
//   },
//   jwtToken: string
// ) => {
//   const client = new GraphQLClient(GQL_ENDPOINT, {
//     headers: {
//       authorization: `Bearer ${jwtToken}`,
//     },
//   });
//   const sdk = getSdk(client);

//   const { searchOnlineBooks } = await sdk.searchOnlineBooks(args);
//   return searchOnlineBooks;
// };

// let TEMP_ONLINE_INPUT: SearchBookInput = {};
// let TEMP_ONLINE_LIMIT: number;
// export const initializeSearchOnline = createAsyncThunk(
//   "task/initializeSearchOnline",
//   async (
//     args: {
//       input: SearchBookInput;
//       limit?: number;
//     },
//     { getState }
//   ) => {
//     let { input, limit } = args;
//     const { auth } = getState() as { auth: { jwtToken: string } };
//     if (!limit) {
//       limit = DEFAULT_ONLINE_BOOKS_PER_QUERY;
//     }
//     if (limit > MAX_ONLINE_BOOKS_PER_QUERY) {
//       limit = MAX_ONLINE_BOOKS_PER_QUERY;
//     }

//     TEMP_ONLINE_INPUT = input;
//     TEMP_ONLINE_LIMIT = limit;

//     return await searchOnlineBooks(
//       {
//         input: args.input,
//         offset: 0,
//         limit,
//       },
//       auth.jwtToken
//     );
//   }
// );

// export const continueSearchOnline = createAsyncThunk(
//   "task/continueSearchOnline",
//   async (_, { getState }) => {
//     const { auth } = getState() as { auth: { jwtToken: string } };
//     const { search } = getState() as {
//       search: {
//         openLibraryBooks: {
//           limit: number;
//           offset: number;
//           input: SearchBookInput;
//         };
//       };
//     };

//     return await searchOnlineBooks(
//       {
//         input: search.openLibraryBooks.input,
//         offset: search.openLibraryBooks.offset,
//         limit: search.openLibraryBooks.limit,
//       },
//       auth.jwtToken
//     );
//   }
// );

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCurrentSelectedBook: (
      state,
      action: PayloadAction<SelectedBook | null>
    ) => {
      state.currentSelectedBook = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder

  //     //load initial
  //     .addCase(initializeSearchOnline.pending, (state, action) => {
  //       state.openLibraryBooks.loading = true;
  //       state.openLibraryBooks.searchInput = TEMP_ONLINE_INPUT;
  //       state.openLibraryBooks.limit = TEMP_ONLINE_LIMIT;
  //     })
  //     .addCase(initializeSearchOnline.fulfilled, (state, action) => {
  //       const books = action.payload;
  //       state.openLibraryBooks.data = books;
  //       state.openLibraryBooks.offset = books.length;

  //       //stop loading
  //       state.openLibraryBooks.loading = false;
  //     })
  //     .addCase(initializeSearchOnline.rejected, (state, action) => {
  //       state.openLibraryBooks.loading = false;
  //       state.openLibraryBooks.error = {
  //         message:
  //           `${action.error.name || "Error: "}: ${action.error.message}` ||
  //           `${
  //             action.error.name || "Error: "
  //           }: Failed to login with graphql server`,
  //         code: action.error.code || "500",
  //       };
  //     })

  //     //load next
  //     .addCase(continueSearchOnline.pending, (state, action) => {
  //       state.openLibraryBooks.loading = true;
  //     })
  //     .addCase(continueSearchOnline.fulfilled, (state, action) => {
  //       const books = [...state.openLibraryBooks.data];
  //       action.payload.forEach((e) => {
  //         if (e) {
  //           books.push(e);
  //         }
  //       });
  //       state.openLibraryBooks.data = books;
  //       state.openLibraryBooks.offset += action.payload.length;

  //       //stop loading
  //       state.openLibraryBooks.loading = false;
  //     })
  //     .addCase(continueSearchOnline.rejected, (state, action) => {
  //       state.openLibraryBooks.loading = false;
  //       state.openLibraryBooks.error = {
  //         message:
  //           `${action.error.name || "Error: "}: ${action.error.message}` ||
  //           `${
  //             action.error.name || "Error: "
  //           }: Failed to login with graphql server`,
  //         code: action.error.code || "500",
  //       };
  //     });
  // },
});

export const { setCurrentSelectedBook } = searchSlice.actions;

//openLibraryBooks selector
// export const selectOnlineBooks = (
//   state: RootState,
//   offset: number,
//   limit: number
// ) => state.search.openLibraryBooks.data.slice(offset, offset + limit);
// export const selectOnlineBooksLoading = (state: RootState) =>
//   state.search.openLibraryBooks.loading;
// export const selectOnlineBooksError = (state: RootState) =>
//   state.search.openLibraryBooks.error;
// export const selectOnlineBooksOffset = (state: RootState) =>
//   state.search.openLibraryBooks.offset;
// export const selectOnlineBooksLimit = (state: RootState) =>
//   state.search.openLibraryBooks.limit;

export const selectCurrentSelectedBook = (state: RootState) =>
  state.search.currentSelectedBook;
export default searchSlice.reducer;

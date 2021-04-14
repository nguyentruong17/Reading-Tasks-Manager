import ObjectId from "bson-objectid";
//redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

//graphql
import { Search_BaseBook_All_Fragment } from "gql/generated/gql-types";

export interface ISelectedBook extends Search_BaseBook_All_Fragment {
  bookId?: ObjectId;
}

interface SearchState {
  currentSelectedBook: ISelectedBook | null;
  currentOpenLibrarySearch: string;
  currentUsersAddedSearch: string;
  isSearchingOpenLibrary: boolean;
}

const initialState: SearchState = {
  currentSelectedBook: null,
  currentOpenLibrarySearch: "",
  currentUsersAddedSearch: "",
  isSearchingOpenLibrary: true,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCurrentSelectedBook: (
      state,
      action: PayloadAction<ISelectedBook | null>
    ) => {
      state.currentSelectedBook = action.payload;
    },
    setCurrentOpenLibrarySearch: (state, action: PayloadAction<string>) => {
      state.currentOpenLibrarySearch = action.payload;
    },
    setCurrentUsersAddedSearch: (state, action: PayloadAction<string>) => {
      state.currentUsersAddedSearch = action.payload;
    },
    setIsSearchingOpenLibrary: (state, action: PayloadAction<boolean>) => {
      state.isSearchingOpenLibrary = action.payload;
    },
  },
});

export const {
  setCurrentSelectedBook,
  setCurrentOpenLibrarySearch,
  setCurrentUsersAddedSearch,
  setIsSearchingOpenLibrary,
} = searchSlice.actions;

export const selectCurrentSelectedBook = (state: RootState) =>
  state.search.currentSelectedBook;
export const selectCurrentOpenLibrarySearch = (state: RootState) =>
  state.search.currentOpenLibrarySearch;
export const selectCurrentUsersAddedSearch = (state: RootState) =>
  state.search.currentUsersAddedSearch;
export const selectIsSearchingOpenLibrary = (state: RootState) =>
  state.search.isSearchingOpenLibrary;
export default searchSlice.reducer;

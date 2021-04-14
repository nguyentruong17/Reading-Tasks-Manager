//redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export enum OperationState {
  None = "NONE",
  Create = "CREATE",
  Read = "READ",
  Update = "UPDATE",
  UpdateAttachItemOnly = "UPDATE ATTACH ITEM ONLY",
  Delete = "DELETE",
}
interface crudTaskState {
  operation: OperationState;
  createWithSelectedBook: boolean;
  updateHasAttachItem: boolean;
  currentTaskId: string;
}

const initialState: crudTaskState = {
  operation: OperationState.None,
  createWithSelectedBook: false,
  updateHasAttachItem: false,
  currentTaskId: "",
};

export const crudTaskSlice = createSlice({
  name: "crudTask",
  initialState,
  reducers: {
    setOperation: (state, action: PayloadAction<OperationState>) => {
      const prevOperation = state.operation;
      if (action.payload === OperationState.UpdateAttachItemOnly) {
        if (prevOperation === OperationState.Create) {
          
        } else {
          if (prevOperation !== OperationState.Update) {
            state.operation = action.payload;
          }
          state.updateHasAttachItem = true;
        }
      } else if (action.payload === OperationState.Update) {
        if (prevOperation === OperationState.Create) {
        } else {
          state.operation = action.payload;
          if (prevOperation === OperationState.UpdateAttachItemOnly) {
            state.updateHasAttachItem = true;
          } else {
            state.updateHasAttachItem = false;
          }
        }
      } else {
        state.operation = action.payload;
        state.updateHasAttachItem = false;
      }
    },
    setCreateWithSelectedBook: (state, action: PayloadAction<boolean>) => {
      state.createWithSelectedBook = action.payload;
    },
    setCurrentTaskId: (state, action: PayloadAction<string>) => {
      state.currentTaskId = action.payload;
    },
  },
});

export const {
  setOperation,
  setCreateWithSelectedBook,
  setCurrentTaskId,
} = crudTaskSlice.actions;

export const selectOperation = (state: RootState) => state.crudTask.operation;
export const selectCreateWithSelectedBook = (state: RootState) =>
  state.crudTask.createWithSelectedBook;
export const selectCurrentTaskId = (state: RootState) =>
  state.crudTask.currentTaskId;
export const selectUpdateHasAttachItem = (state: RootState) =>
  state.crudTask.updateHasAttachItem;
export default crudTaskSlice.reducer;

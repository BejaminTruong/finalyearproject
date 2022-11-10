import { createSlice } from "@reduxjs/toolkit";
import { mapOrder } from "utilities/sorts";
import _ from "lodash";

const initialState = {
  _id: "",
  title: "",
  columnOrder: [],
  members: [],
  columns: [],
  createdAt: null,
  updatedAt: null,
  pending: true,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    startFetchingBoard: (state) => {
      state.pending = true;
    },
    successFetchingBoard: (state, action) => {
      state.pending = false;
      state._id = action.payload._id;
      state.title = action.payload.title;
      state.members = action.payload.members;
      state.columnOrder = action.payload.columnOrder;
      state.columns = mapOrder(
        action.payload.columns,
        action.payload.columnOrder,
        "_id"
      );
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    failedFetchingBoard: (state) => {
      state.pending = false;
    },
    updateData: (state, action) => {
      state.title = action.payload.title;
      state.members = action.payload.members;
      state.columnOrder = action.payload.columnOrder;
      state.columns = mapOrder(
        action.payload.columns,
        action.payload.columnOrder,
        "_id"
      );
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    successCreatingColumn: (state, action) => {
      state.columns.push(action.payload);
      state.columnOrder = state.columns.map((c) => c._id);
    },
    updateColumnData: (state, action) => {
      state.columns.forEach((column) => {
        action.payload.forEach((c) => {
          if (column._id === c._id) {
            column.title = c.title;
            column.cardOrder = c.cardOrder;
            column.cards = mapOrder(c.cards, c.cardOrder, "_id");
            column.createdAt = c.createdAt;
            column.updatedAt = c.updatedAt;
          }
        });
      });
    },
    successCreatingCard: (state, action) => {
      state.columns.forEach((column) => {
        if (column._id === action.payload.columnId) {
          column.cards.push(action.payload);
          column.cardOrder.push(action.payload._id);
        }
      });
    },
  },
});

export const {
  startFetchingBoard,
  failedFetchingBoard,
  successFetchingBoard,
  updateData,
  successCreatingColumn,
  updateColumnData,
  successCreatingCard,
} = boardSlice.actions;

export const selectBoard = (state) => state.board;

export default boardSlice.reducer;

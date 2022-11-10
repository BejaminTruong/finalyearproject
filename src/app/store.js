import { configureStore } from "@reduxjs/toolkit";
import userReducer from "features/userSlice";
import alertReducer from "features/alertSlice";
import boardsReducer from "features/boardsSlice";
import boardReducer from "features/boardSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    boards: boardsReducer,
    board: boardReducer,
  },
});

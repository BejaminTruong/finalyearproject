import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  variant: "danger",
  message: "",
  delay: 3000,
  nextRoute: null,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlert: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.variant = action.payload.variant;
      state.delay = action.payload.delay
        ? action.payload.delay
        : initialState.delay;
      state.nextRoute = action.payload.nextRoute
        ? action.payload.nextRoute
        : null;
    },
    closeAlert: (state) => {
      state.show = false;
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;

export const selectAlert = (state) => state.alert;

export default alertSlice.reducer;
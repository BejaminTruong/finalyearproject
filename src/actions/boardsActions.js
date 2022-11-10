import axios from "axios";
import { API_ROOT } from "utilities/constants";
import { openAlert } from "features/alertSlice";
import { addNewBoard } from "features/userSlice";
import {
  failFetchingBoards,
  startFetchingBoards,
  successFetchingBoards,
  successCreatingBoard,
  failCreatingBoard,
  startCreatingBoard,
} from "features/boardsSlice";

export const getBoards = async (dispatch) => {
  dispatch(startFetchingBoards());
  try {
    const res = await axios.get(`${API_ROOT}/v1/boards`);
    dispatch(successFetchingBoards({ boards: res.data }));
  } catch (error) {
    dispatch(failFetchingBoards());
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const createBoard = async (data, dispatch) => {
  dispatch(startCreatingBoard());
  try {
    const res = await axios.post(`${API_ROOT}/v1/boards`, data);
    dispatch(addNewBoard(res.data));
    dispatch(successCreatingBoard(res.data));
    dispatch(
      openAlert({
        message: `${res.data.title} board has been successfully created`,
        variant: "success",
      })
    );
  } catch (error) {
    dispatch(failCreatingBoard());
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

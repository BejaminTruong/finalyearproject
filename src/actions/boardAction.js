import axios from "axios";
import { openAlert } from "features/alertSlice";
import {
  failedFetchingBoard,
  startFetchingBoard,
  successCreatingColumn,
  successFetchingBoard,
  updateColumnData,
  updateData,
  successCreatingCard,
} from "features/boardSlice";
import { API_ROOT } from "utilities/constants";

export const getOneBoard = async (boardId, dispatch) => {
  dispatch(startFetchingBoard());
  try {
    const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
    dispatch(successFetchingBoard(res.data));
  } catch (error) {
    dispatch(failedFetchingBoard());
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const boardUpdate = async (boardData, dispatch) => {
  try {
    const res = await axios.put(
      `${API_ROOT}/v1/boards/${boardData._id}`,
      boardData
    );
    if (boardData._destroy) {
      dispatch(
        openAlert({
          message: `${boardData.title} deleted successfully`,
          variant: "success",
          delay: 2000,
          nextRoute: "/boards",
        })
      );
    } else dispatch(updateData(res.data));
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const createColumn = async (data, dispatch) => {
  try {
    const res = await axios.post(`${API_ROOT}/v1/columns`, data);
    dispatch(successCreatingColumn(res.data));
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const updateColumn = async (columnData, dispatch) => {
  try {
    const res = await axios.put(
      `${API_ROOT}/v1/columns/${columnData._id}`,
      columnData
    );
    if (columnData._destroy) dispatch(updateData(res.data));
    else dispatch(updateColumnData(res.data.columns));
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const createCard = async (data, dispatch) => {
  try {
    const res = await axios.post(`${API_ROOT}/v1/cards`, data);
    dispatch(successCreatingCard(res.data));
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const updateCard = async (cardData, dispatch) => {
  try {
    const res = await axios.put(
      `${API_ROOT}/v1/cards/${cardData._id}`,
      cardData
    );
    dispatch(updateData(res.data));
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const getUserByEmail = async (email, dispatch) => {
  try {
    const result = await axios.get(
      `${API_ROOT}/v1/users/getUserByEmail/${email}`
    );
    return result.data;
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const updateMember = async (
  memberId,
  boardData,
  condition,
  dispatch
) => {
  try {
    const result = await axios.post(
      `${API_ROOT}/v1/boards/updateMember/${memberId}`,
      { boardData, condition }
    );
    dispatch(updateData(result.data));
    if (condition)
      dispatch(
        openAlert({
          message: "New member added to this board successfully!",
          variant: "success",
        })
      );
    else
      dispatch(
        openAlert({
          message: "A member has been removed from this board successfully!",
          variant: "success",
        })
      );
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

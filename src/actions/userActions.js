import axios from "axios";
import { API_ROOT } from "utilities/constants";
import setBearer from "utilities/setBearer";
import { openAlert } from "features/alertSlice";
import {
  loadFailure,
  loadStart,
  loadSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  registrationEnd,
  registrationStart,
  updateFailed,
  updateStart,
  updateSuccess,
} from "features/userSlice";

export const register = async (
  { name, email, password, repeated_password },
  dispatch
) => {
  dispatch(registrationStart());
  if (password !== repeated_password) {
    dispatch(
      openAlert({
        message: "Your passwords does not match!",
        variant: "danger",
      })
    );
  } else {
    try {
      await axios.post(`${API_ROOT}/v1/users/register`, {
        name,
        email,
        password,
        repeated_password,
      });
      dispatch(
        openAlert({
          message: "Registered successfully!",
          variant: "success",
          delay: 2000,
          nextRoute: "/login",
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
  }
  dispatch(registrationEnd());
};

export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_ROOT}/v1/users/login`, {
      email,
      password,
    });
    const user = res.data;
    localStorage.setItem("token", user.token);
    setBearer(user.token);
    dispatch(loginSuccess({ user }));
    dispatch(
      openAlert({
        message: "Login successfully!",
        variant: "success",
        delay: 2000,
        nextRoute: "/boards",
      })
    );
  } catch (error) {
    dispatch(loginFailure());
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};

export const loadUser = async (dispatch) => {
  dispatch(loadStart());
  if (!localStorage.token) return dispatch(loadFailure());
  setBearer(localStorage.token);
  try {
    const res = await axios.get(`${API_ROOT}/v1/users/getUser`);
    const user = res.data;
    dispatch(loadSuccess({ user }));
  } catch (error) {
    dispatch(loadFailure());
  }
};

export const updateUser = async ({ id, data }, dispatch) => {
  dispatch(updateStart());
  try {
    const res = await axios.put(`${API_ROOT}/v1/users/update/${id}`, data);
    dispatch(updateSuccess({ user: res.data }));
    dispatch(
      openAlert({
        message: "Update successfully!",
        variant: "success",
        delay: 2000,
      })
    );
  } catch (error) {
    dispatch(updateFailed());
    dispatch(
      openAlert({
        message: error?.response.data.errors,
        variant: "danger",
      })
    );
  }
};
import axios from "axios";

import {
  loginAuthRequest,
  loginAuthSuccess,
  loginAuthError,
} from "./auth-actions";

const BASE_URL = "http://localhost:5000";

const tok = {
  // eslint-disable-next-line no-shadow
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

const authLogin = (user) => async (dispatch) => {
  dispatch(loginAuthRequest());
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, user);
    tok.set(data.token);
    dispatch(loginAuthSuccess(data));
  } catch (error) {
    dispatch(loginAuthError(error));
  }
};

const verify = (token) => async (dispatch) => {
  dispatch(loginAuthRequest());
  try {
    tok.set(token);
    const { data } = await axios.get(`${BASE_URL}/auth/verify`);
    dispatch(loginAuthSuccess(data));
  } catch (error) {
    dispatch(loginAuthError(error));
  }
};

const operations = {
  authLogin,
  verify,
};

export default operations;

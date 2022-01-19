import { combineReducers } from "redux";
import { createReducer } from "@reduxjs/toolkit";
import {
  // loginAuthRequest,
  loginAuthSuccess,
  // loginAuthError,
  logOutAuthSuccess,
  updateUserSuccess,
} from "./auth-actions";

const initialState = {
  isLogIn: false,
  user: null,
  token: null,
};

const user = createReducer(initialState, {
  [loginAuthSuccess]: (_, { payload }) => ({
    isLogIn: true,
    ...payload.user,
  }),
  [logOutAuthSuccess]: () => initialState,
  [updateUserSuccess]: (_, { payload }) => ({ ...payload }),
});

const token = createReducer(initialState, {
  [loginAuthSuccess]: (_, { payload }) => payload.token,
  [logOutAuthSuccess]: () => null,
});

// const authLogOut = createReducer(initialState, {
//   [logOutAuthSuccess]: () => initialState,
// });

const authReducers = combineReducers({
  user,
  token,
});

export default authReducers;

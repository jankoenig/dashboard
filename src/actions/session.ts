import { push } from "react-router-redux";

import { SENDING_REQUEST, SET_USER } from "../constants";
import User from "../models/user";
import auth from "../services/auth";

export function sendingRequest(sending: boolean) {
  return {
    type: SENDING_REQUEST,
    sending: sending
  };
}

export function setUser(user: User | undefined) {
  return {
    type: SET_USER,
    user: user
  };
}


export function login(email: string, password: string) {
  return function (dispatch: Redux.Dispatch<any>) {
    loginMethod(dispatch, function(callback) {
      auth.login(email, password, callback);
    });
  };
}

export function loginWithGithub() {
  return function (dispatch: Redux.Dispatch<any>) {
    loginMethod(dispatch, function(callback) {
      auth.loginWithGithub(callback);
    });
  };
}

export function logout() {
  return function (dispatch: Redux.Dispatch<any>) {
    auth.logout(function(success) {
      if (success) {
        dispatch(push("/login"));
      }
    });
  };
}

function loginMethod(dispatch: Redux.Dispatch<any>, login: (callback: (success: boolean, error?: string) => void) => void) {
  dispatch(sendingRequest(true));
  login(function(success, error) {
      dispatch(sendingRequest(false));
      dispatch(setUser(auth.user()));

      if (success) {
        dispatch(push("/"));
      } else {
        // clear the password
        // set the error
      }
  });
}
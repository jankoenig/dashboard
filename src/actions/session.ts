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

    dispatch(sendingRequest(true));

    auth.login(email, password, (success, error) => {

      dispatch(sendingRequest(false));
      dispatch(setUser(auth.user()));

      if (success) {
        dispatch(push("/"));
      } else {
        // clear the password
        // set the error
      }
    });
  };
}

export function loginWithGithub() {
  return function (dispatch: Redux.Dispatch<any>) {

    dispatch(sendingRequest(true));

    auth.loginWithGithub(function(success, error) {

      dispatch(sendingRequest(false));
      dispatch(setUser(auth.user()));

      if (success) {
        dispatch(push("/"));
      } else {
        // clear the password
        // set the error
      }
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
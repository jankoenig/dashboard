import { push } from "react-router-redux";

import { SENDING_REQUEST, SET_AUTH, SET_USER } from "../constants";
import User from "../models/user";
import auth from "../services/auth";

export function sendingRequest(sending: boolean) {
  return {
    type: SENDING_REQUEST,
    sending
  };
}

export function setAuthToken(token?: string) {
  return {
    type: SET_AUTH,
    token
  };
}

export function setUser(user: User) {
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
        // clear the fields
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
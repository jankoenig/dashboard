import { goBack, push, replace } from "react-router-redux";

import { authFormError } from "../actions/auth-form";
import { displaySnackbar } from "../actions/notification";
import { LOGOUT_USER, SENDING_REQUEST, SET_USER } from "../constants";
import User from "../models/user";
import auth from "../services/auth";

export function sendingRequest(sending: boolean) {
  return {
    type: SENDING_REQUEST,
    sending: sending
  };
}

export type SetUser = {
  type: SET_USER,
  user: User | undefined
};

export function setUser(user: User | undefined): SetUser {
  return {
    type: SET_USER,
    user: user
  };
}

export interface SuccessCallback {
  loginSuccess(dispatch: Redux.Dispatch<any>, user: User): void;
}

export class BackCallback implements SuccessCallback {
  loginSuccess(dispatch: Redux.Dispatch<any>, user: User): void {
    dispatch(goBack());
  }
}

export class ToPathCallback implements SuccessCallback {
  toPath: string;

  public constructor(toPath: string) {
    this.toPath = toPath;
  }

  loginSuccess(dispatch: Redux.Dispatch<any>, user: User): void {
    dispatch(replace(this.toPath));
  }
}

class DefaultRedirectCallback extends ToPathCallback {
  constructor() {
    super("/#welcome"); // The hash is used to track logins
  }
};

function loginMethod(dispatch: Redux.Dispatch<any>, redirectStrat: SuccessCallback = new DefaultRedirectCallback(), loginStrat: () => Promise<User>): Promise<User> {
  dispatch(sendingRequest(true));
  return loginStrat()
    .then(function (user: User) {
      dispatch(sendingRequest(false));
      dispatch(setUser(auth.user()));

      redirectStrat.loginSuccess(dispatch, auth.user());

      return user;
    }).catch(function (err: Error) {
      dispatch(authFormError(err.message));
      throw err;
    });
}

export function login(email: string, password: string, redirectStrat?: SuccessCallback): (dispatch: Redux.Dispatch<any>) => Promise<User> {
  return function (dispatch: Redux.Dispatch<any>): Promise<User> {
    return loginMethod(dispatch, redirectStrat, function () {
      return auth.login(email, password);
    });
  };
}

export function loginWithGithub(redirectStrat?: SuccessCallback): (dispatch: Redux.Dispatch<any>) => Promise<User> {
  return function (dispatch: Redux.Dispatch<any>) {
    return loginMethod(dispatch, redirectStrat, function () {
      return auth.loginWithGithub();
    });
  };
}

export function signUpWithEmail(email: string, password: string, confirmPassword: string, redirectStrat?: SuccessCallback): (dispatch: Redux.Dispatch<any>) => Promise<User> {
  return function (dispatch: Redux.Dispatch<any>) {
    return loginMethod(dispatch, redirectStrat, function () {
      return auth.signUpWithEmail(email, password, confirmPassword);
    });
  };
}

export function logout(callback?: (success: boolean) => void): (dispatch: Redux.Dispatch<any>) => Promise<void> {
  return function (dispatch: Redux.Dispatch<void>) {
    return auth.logout().then(function () {
      dispatch({ type: LOGOUT_USER });
      dispatch(push("/login"));
      if (callback) {
        callback(true);
      }
    }).catch(function (err: Error) {
      if (callback) {
        callback(false);
      }
    });
  };
}

export function resetPassword(email: string, callback?: (success: boolean) => void): (dispatch: Redux.Dispatch<any>) => Promise<void> {
  return function (dispatch: Redux.Dispatch<void>) {
    return auth.sendResetPasswordEmail(email).then(function () {
      dispatch(displaySnackbar("Check your inbox!"));
      if (callback) {
        callback(true);
      }
    }).catch(function (error: Error) {
      dispatch(authFormError(error.message));
      if (callback) {
        callback(false);
      }
    });
  };
}
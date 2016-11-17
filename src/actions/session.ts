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
}

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

function loginMethod(dispatch: Redux.Dispatch<any>, redirectStrat: SuccessCallback = new DefaultRedirectCallback(), loginStrat: (callback: (success: boolean, error?: string) => void) => void) {
  dispatch(sendingRequest(true));
  loginStrat(function (success, error) {
    dispatch(sendingRequest(false));
    dispatch(setUser(auth.user()));

    if (success) {
      redirectStrat.loginSuccess(dispatch, auth.user());
    } else {
      if (error) {
        dispatch(authFormError(error));
      }
    }
  });
}

export function login(email: string, password: string, redirectStrat?: SuccessCallback) {
  return function (dispatch: Redux.Dispatch<any>) {
    loginMethod(dispatch, redirectStrat, function (internalCallback) {
      auth.login(email, password, internalCallback);
    });
  };
}

export function loginWithGithub(redirectStrat?: SuccessCallback) {
  return function (dispatch: Redux.Dispatch<any>) {
    loginMethod(dispatch, redirectStrat, function (internalCallback) {
      auth.loginWithGithub(internalCallback);
    });
  };
}

export function signUpWithEmail(email: string, password: string, confirmPassword: string, redirectStrat?: SuccessCallback) {
  return function (dispatch: Redux.Dispatch<any>) {
    loginMethod(dispatch, redirectStrat, function (internalCallback) {
      auth.signUpWithEmail(email, password, confirmPassword, internalCallback);
    });
  };
}

export function logout() {
  return function (dispatch: Redux.Dispatch<void>) {
    auth.logout(function (success) {
      if (success) {
        dispatch({ type: LOGOUT_USER });
        dispatch(push("/login"));
      }
    });
  };
}

export function resetPassword(email: string) {
  return function (dispatch: Redux.Dispatch<void>) {
    auth.sendResetPasswordEmail(email, function (success, error) {
      if (success) {
        dispatch(displaySnackbar("Check your inbox!"));
      } else {
        dispatch(authFormError(error));
      }
    });
  };
}
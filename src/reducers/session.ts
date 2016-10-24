import * as objectAssign from "object-assign";

import { SET_USER } from "../constants";
import User  from "../models/user";
import auth from "../services/auth";

export type SessionState = {
  user?: User,
  hasError: boolean,
  isLoading: boolean
}

const INITIAL_STATE: SessionState = {
  hasError: false,
  isLoading: false,
  user: auth.user() // Not sure if I like this pattern, should the session reducer have direct access to auth.user()? Might be better to set this early on through a dispatch(setUser()) during bootstrap.
};

export function session(state: SessionState = INITIAL_STATE, action: any = { type: ""}) {

  switch (action.type) {
    case SET_USER:
      let userSessionState: SessionState = objectAssign({}, state, {user: action.user});
      return userSessionState;
    default:
      return state;
  }
}

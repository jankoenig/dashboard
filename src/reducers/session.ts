import { SET_AUTH, SET_USER } from "../constants";
import User  from "../models/user";
import * as objectAssign from "object-assign";

export type SessionState = {
  user?: User,
  hasError: boolean,
  isLoading: boolean
}

const INITIAL_STATE: SessionState = {
  hasError: false,
  isLoading: false,
};

export function session(state: SessionState = INITIAL_STATE, action: any = { type: ''}) {

  switch (action.type) {
    case SET_USER:
      let userSessionState: SessionState = objectAssign({}, state, {user: action.user});
      console.log(userSessionState);
      return userSessionState;
    case SET_AUTH:
      let newSessionState: SessionState = objectAssign({}, state, action);
      return newSessionState;
    default:
      return state;
  }
}

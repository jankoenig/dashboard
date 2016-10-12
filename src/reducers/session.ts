import { SET_AUTH } from "../constants";
import { User } from "../models/user";
import * as objectAssign from "object-assign";

export type SessionState = {
  token?: string,
  user?: User,
  hasError: boolean,
  isLoading: boolean
}

const INITIAL_STATE: SessionState = {
  hasError: false,
  isLoading: false
};

export function session(state: SessionState = INITIAL_STATE, action: any = { type: ''}) {
  console.log("session reducer");
  console.log(action);
  console.log(state);

  switch (action.type) {
    case SET_AUTH:
      let newSessionState: SessionState = objectAssign({}, state, action);
      console.log(newSessionState);
      return newSessionState;

    default:
      return state;
  }
}

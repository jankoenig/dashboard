import * as objectAssign from "object-assign";

import { SetUser } from "../actions/session";
import { SET_USER } from "../constants";
import User  from "../models/user";

export type SessionState = {
  readonly user?: User,
  readonly hasError: boolean,
  readonly isLoading: boolean
};

const INITIAL_STATE: SessionState = {
  hasError: false,
  isLoading: false
};

type SessionStateAction = SetUser | {type: ""};

export function session(state: SessionState = INITIAL_STATE, action: SessionStateAction): SessionState {

  switch (action.type) {
    case SET_USER:
      return objectAssign({}, state, {user: action.user});
    default:
      return state;
  }
}

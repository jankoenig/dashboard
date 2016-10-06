import { token } from "../auth";
import { fromJS } from "immutable";
import { User } from "../models/user";

const INITIAL_STATE = fromJS({
  token: token(),
  user: {},
  hasError: false,
  isLoading: false,
});

export type SessionState = {
  token: string,
  user?: User,
  hasError: boolean,
  isLoading: boolean
}

function sessionReducer() {
  return INITIAL_STATE;
}

export default sessionReducer;

import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { authForm, AuthFormState } from "./authForm";
import { logReducer, LogState } from "./log";
import { session, SessionState } from "./session";

export namespace State {
  export type All = {
    session: SessionState,
    authForm: AuthFormState,
    logs: LogState,
    error: string,
    routing: any
  }
}

const rootReducer = combineReducers<State.All>({
  session,
  authForm,
  logs: logReducer,
  routing: routerReducer
});

export default rootReducer;

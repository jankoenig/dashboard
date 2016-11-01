import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { authForm, AuthFormState } from "./authForm";
import { logReducer, LogState } from "./log";
import { session, SessionState } from "./session";
import { source, SourceState } from "./source";

export namespace State {
  export type All = {
    session: SessionState,
    source: SourceState;
    authForm: AuthFormState,
    logs: LogState,
    error: string,
    routing: any
  }
}

const rootReducer = combineReducers<State.All>({
  session,
  source,
  authForm,
  logs: logReducer,
  routing: routerReducer
});

export default rootReducer;

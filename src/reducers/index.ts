import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { authForm, AuthFormState } from "./auth-form";
import { log, LogState } from "./log";
import { session, SessionState } from "./session";
import { source, SourceState } from "./source";

export namespace State {
  export type All = {
    session: SessionState,
    source: SourceState;
    authForm: AuthFormState,
    log: LogState,
    routing: any
  }
}

const rootReducer = combineReducers<State.All>({
  session,
  source,
  authForm,
  log,
  routing: routerReducer
});

export default rootReducer;

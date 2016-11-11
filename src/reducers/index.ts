import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { LOGOUT_USER } from "../constants";
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

const appReducer = combineReducers<State.All>({
  session,
  source,
  authForm,
  log,
  routing: routerReducer
});

// Intercept global actions, such as logout to reset the state.
// From http://stackoverflow.com/a/35641992/1349766
const rootReducer = function(state: State.All, action: Redux.Action) {

  if (action.type === LOGOUT_USER) {
    state = undefined;
  }

  // and pass it on to the high level reducers
  return appReducer(state, action);
};

export default rootReducer;

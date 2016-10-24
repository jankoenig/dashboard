import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { authForm, AuthFormState } from "./authForm";
import { logReducer, LogState } from "./log";
import { session, SessionState } from "./session";

export namespace Store {
  export type All = {
    session: SessionState,
    authForm: AuthFormState,
    logs: LogState,
    error: string,
    routing: any
  }
}

const rootReducer = combineReducers<Store.All>({
  session,
  authForm,
  logs: logReducer,
  routing: routerReducer
});

export default rootReducer;

import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { authForm, AuthFormState } from "./authForm";
import { session, SessionState } from "./session";

export namespace Store {
  export type All = {
    session: SessionState,
    authForm: AuthFormState,
    error: string,
    routing: any
  }
}

const rootReducer = combineReducers<Store.All>({
  session,
  authForm,
  routing: routerReducer
});

export default rootReducer;

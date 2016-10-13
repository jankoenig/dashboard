import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import { SessionState, session } from "./session";
import { AuthFormState, authForm } from "./authForm";


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

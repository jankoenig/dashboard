import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import { SessionState, session } from "./session";
import { FormState, form } from "./form";


export namespace Store {
  export type All = {
    session: SessionState,
    form: FormState,
    error: string,
    routing: any
  }
}

const rootReducer = combineReducers<Store.All>({
  session,
  form,
  routing: routerReducer
});

export default rootReducer;

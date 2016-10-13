import { combineReducers } from "redux";
import { SessionState, session } from "./session";
import { FormState, form } from "./form";
import counter from "./counter";
import { routerReducer } from "react-router-redux";

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
  counter,
  routing: routerReducer
});

export default rootReducer;

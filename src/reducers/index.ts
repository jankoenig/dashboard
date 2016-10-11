import { combineReducers } from "redux";
import { SessionState, session } from "./session";
import { FormState, form } from "./form";
import counter from "./counter";

export namespace Store {
  export type All = {
    session: SessionState,
    form: FormState,
    error: string,
  }
}

const rootReducer = combineReducers<Store.All>({
  session,
  form,
  counter
});

export default rootReducer;

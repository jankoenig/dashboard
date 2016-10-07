import { combineReducers } from "redux";
import { Session, session } from "./session";

export namespace Store {
  export type All = {
    session: Session,
    error: string,
  }
}

const rootReducer = combineReducers<Store.All>({
  session,
});

export default rootReducer;

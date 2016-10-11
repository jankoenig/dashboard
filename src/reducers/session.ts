
import { User } from "../models/user";

export type SessionState = {
  token: string,
  user?: User,
  hasError: boolean,
  isLoading: boolean
}

const INITIAL_STATE: SessionState = {
  token: "myToken",
  hasError: false,
  isLoading: false
};

export function session() {
  return INITIAL_STATE;
}

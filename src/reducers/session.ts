
import { User } from "../models/user";

export type Session = {
  token: string,
  user?: User,
  hasError: boolean,
  isLoading: boolean
}

const INITIAL_STATE: Session = {
  token: "myToken",
  hasError: false,
  isLoading: false
};

export function session() {
  return INITIAL_STATE;
}

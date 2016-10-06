
export const LOGIN_USER = "LOGIN_USER";
export type LOGIN_USER  = { username: string, password: string };

export function loginUser(): Redux.ThunkAction<void, LOGIN_USER, void> {
  return (dispatch, getState) => {
    console.log("loginUser");
    console.log(dispatch);
  };
}

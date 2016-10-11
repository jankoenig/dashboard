
export const LOGIN_USER = "LOGIN_USER";
export type LOGIN_USER  = { email: string, password: string };

export function login(): Redux.ThunkAction<void, LOGIN_USER, void> {
  return (dispatch, getState) => {
    console.log("loginUser");
    console.log(dispatch);
  };
}

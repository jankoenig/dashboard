import { SENDING_REQUEST, SET_AUTH } from "../constants";
import { browserHistory } from 'react-router';

export function sendingRequest(sending: boolean) {
  return {
    type: SENDING_REQUEST,
    sending
  };
}

export function setAuthToken(token?: string) {
  return {
    type: SET_AUTH,
    token
  };
}

export function loginAsync(email: string, password: string) {
  console.log("loginAsync outside");
  return function (dispatch: Redux.Dispatch<any>) {
    console.log("loginAsync");
    console.log(dispatch);
    dispatch(sendingRequest(true));

    setTimeout(() => {
      if (email === password) {
        dispatch(setAuthToken("token"));
        browserHistory.push("/");
      } else {
        dispatch(setAuthToken());
      }
    }, 1000);
  };
}
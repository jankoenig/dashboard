import { Dispatch } from "redux";

import { SET_SNACKBAR_MESSAGE } from "../constants";

export type SetSnackbarMessage = {
    type: SET_SNACKBAR_MESSAGE,
    message: string | undefined
};

export function setSnackbarMessage(message: string | undefined) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        message: message
    };
}

export function displaySnackbar(message: string | undefined, duration: number = 1000) {
    return function (dispatch: Dispatch<any>){
        dispatch(setSnackbarMessage(message));
        // Now, after the provided duration we set it back to undefined, clearing it out
        setTimeout(() => {
            dispatch(setSnackbarMessage(undefined));
        }, duration);
    };
}
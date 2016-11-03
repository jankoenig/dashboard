import { AUTH_ERROR, CHANGE_FORM } from "../constants";

export function changeForm(field: string, value: string) {
    return {
        type: CHANGE_FORM,
        field: field,
        value: value
    };
}

export function changeErrorInForm(value: string) {
    return {
        type: AUTH_ERROR,
        value: value
    };
}
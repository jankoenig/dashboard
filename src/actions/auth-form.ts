import { AUTH_FORM_CHANGED, AUTH_FORM_ERROR } from "../constants";

export type AuthFormChanged = {
    type: AUTH_FORM_CHANGED,
    field: string,
    value: string
}

export function authFormChanged(field: string, value: string): AuthFormChanged {
    return {
        type: AUTH_FORM_CHANGED,
        field: field,
        value: value
    };
}

export type AuthFormError = {
    type: AUTH_FORM_ERROR,
    error: string;
}

export function authFormError(error: string): AuthFormError {
    return {
        type: AUTH_FORM_ERROR,
        error: error
    };
}
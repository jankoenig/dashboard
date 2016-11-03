import { AUTH_ERROR, CHANGE_FORM } from "../constants";

export type ChangeForm = {
    type: CHANGE_FORM,
    field: string,
    value: string
}

export function changeForm(field: string, value: string): ChangeForm {
    return {
        type: CHANGE_FORM,
        field: field,
        value: value
    };
}

export type ChangeErrorInForm = {
    type: AUTH_ERROR,
    value: string;
}

export function changeErrorInForm(value: string): ChangeErrorInForm {
    return {
        type: AUTH_ERROR,
        value: value
    };
}
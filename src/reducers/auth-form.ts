import * as objectAssign from "object-assign";

import { ChangeErrorInForm, ChangeForm } from "../actions/auth-form";
import { AUTH_ERROR, CHANGE_FORM } from "../constants";

export type AuthFormState = {
    readonly email?: string;
    readonly password?: string;
    readonly confirmPassword?: string;
    readonly error?: string;
}

const INITIAL_STATE: AuthFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
};

type AuthFormAction = ChangeErrorInForm | ChangeForm | { type: "" };

export function authForm(state: AuthFormState = INITIAL_STATE, action: AuthFormAction): AuthFormState {

    switch (action.type) {
        case CHANGE_FORM:
            return objectAssign({}, state, { [action.field]: action.value });
        case AUTH_ERROR:
            return objectAssign({}, state, { error: action.value });
        default:
            return state;
    }
}
import * as objectAssign from "object-assign";

import { AuthFormChanged, AuthFormError } from "../actions/auth-form";
import { AUTH_FORM_CHANGED, AUTH_FORM_ERROR } from "../constants";

export type AuthFormState = {
    readonly email?: string;
    readonly password?: string;
    readonly confirmPassword?: string;
    readonly error?: string;
};

const INITIAL_STATE: AuthFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
};

type AuthFormAction = AuthFormChanged | AuthFormError | { type: "" };

export function authForm(state: AuthFormState = INITIAL_STATE, action: AuthFormAction): AuthFormState {

    switch (action.type) {
        case AUTH_FORM_CHANGED:
            return objectAssign({}, state, { [action.field]: action.value });
        case AUTH_FORM_ERROR:
            return objectAssign({}, state, { error: action.error });
        default:
            return state;
    }
}
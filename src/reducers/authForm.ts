import { AUTH_ERROR, CHANGE_FORM } from "../constants";
import * as objectAssign from "object-assign";

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

export function authForm(state: AuthFormState = INITIAL_STATE, action: any = { type: "" }) {
    switch (action.type) {
        case CHANGE_FORM:
            let newFormState: AuthFormState = objectAssign({}, state, { [action.field]: action.value }, {error: ""});
            return newFormState;
        case AUTH_ERROR:
            let errorState: AuthFormState = objectAssign({}, state, { error: action.value });
            return errorState;
        default:
            return state;
    }
}
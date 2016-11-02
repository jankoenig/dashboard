import * as objectAssign from "object-assign";

import { ChangeFormAction } from "../actions/auth-form";
import { CHANGE_FORM } from "../constants";

export type AuthFormState = {
    readonly email?: string;
    readonly password?: string;
    readonly error?: string;
}

const INITIAL_STATE: AuthFormState = {
    email: "",
    password: ""
};

type AuthFormAction = ChangeFormAction | { type: "" };

export function authForm(state: AuthFormState = INITIAL_STATE, action: AuthFormAction): AuthFormState {

    switch (action.type) {
        case CHANGE_FORM:
            return objectAssign({}, state, {[action.field]: action.value});
        default:
            return state;
    }
}
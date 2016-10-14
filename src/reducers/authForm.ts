import { CHANGE_FORM } from "../constants";
import * as objectAssign from "object-assign";

export type AuthFormState = {
    readonly email?: string;
    readonly password?: string;
    readonly error?: string;
}

const INITIAL_STATE: AuthFormState = {
    email: "",
    password: ""
};

export function authForm(state: AuthFormState = INITIAL_STATE, action: any = { type: ""}) {

    switch (action.type) {
        case CHANGE_FORM:
            let newFormState: AuthFormState = objectAssign({}, state, {[action.field]: action.value});
            return newFormState;
        default:
            return state;
    }
} 
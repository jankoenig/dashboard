import { CHANGE_FORM } from "../constants";
import * as objectAssign from "object-assign";

export type FormState = {
    readonly email?: string;
    readonly password?: string;
}

const INITIAL_STATE: FormState = {
    email: "",
    password: ""
};

export function form(state: FormState = INITIAL_STATE, action: any = { type: ''}) {
    // console.log("form reducer");
    // console.log(action);
    // console.log(state);
    switch (action.type) {

        case CHANGE_FORM:
            let newFormState: FormState = objectAssign({}, state, {[action.field]: action.value});
            return newFormState;
        default:
            return state;
    }
} 
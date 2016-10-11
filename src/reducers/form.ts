import { CHANGE_FORM } from "../constants";

export type FormState = {
    email?: string;
    password?: string;
}

const INITIAL_STATE: FormState = {
    email: "",
    password: ""
};

export function form(state: FormState = INITIAL_STATE, action: any = { type: ''}) {
    console.log("form reducer");
    console.log(action);
    switch (action.type) {

        case CHANGE_FORM:
            let newFormState: FormState = {
                email: action.email,
                password: action.password
            };
            return newFormState;
        default:
            return state;
    }
} 
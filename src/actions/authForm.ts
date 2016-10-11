import {CHANGE_FORM} from "../constants";
import { FormState } from "../reducers/form";

export function changeForm(formState: FormState) {
    return {
        type: CHANGE_FORM,
        email: formState.email,
        password: formState.password
    };
}

export function login(formState: FormState) {
    console.log("login");
    console.log(formState);
}
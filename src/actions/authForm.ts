import {CHANGE_FORM} from "../constants";

export function changeForm(field: string, value: string) {
    return {
        type: CHANGE_FORM,
        field: field,
        value: value
    };
}

export function login(email: string, password: string) {
    console.log("login");
    console.log(email);
    console.log(password);
}
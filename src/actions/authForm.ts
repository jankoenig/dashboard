import { CHANGE_FORM } from "../constants";

export function changeForm(field: string, value: string) {
    return {
        type: CHANGE_FORM,
        field: field,
        value: value
    };
}

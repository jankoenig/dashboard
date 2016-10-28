import { CHANGE_FORM } from "../constants";

export type ChangeFormAction = {
    type: CHANGE_FORM,
    field: string,
    value: string
}

export function changeForm(field: string, value: string): ChangeFormAction {
    return {
        type: CHANGE_FORM,
        field: field,
        value: value
    };
}

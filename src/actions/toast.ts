import createToast from "../components/Toast/ToastFactory";
import { ADD_TOAST, REMOVE_TOAST } from "../constants";

export type toastAction = {
    type: ADD_TOAST | REMOVE_TOAST,
    isVisible: boolean,
};

export function addToast(options = {}) {
    return {
        payload: createToast(options),
        type: ADD_TOAST
    };
}

export function removeToast(id: number) {
    return {
        payload: id,
        type: REMOVE_TOAST
    };
}

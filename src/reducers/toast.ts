import { ADD_TOAST, REMOVE_TOAST } from "../constants";

export type ToastState = any[];

const INITIAL_STATE: ToastState = [];

type ToastAction =  { type: ADD_TOAST, payload: any } | { type: REMOVE_TOAST, payload: any };

export function toasts(state: ToastState = INITIAL_STATE, action: ToastAction ): ToastState {
    const { payload }  = action;
    switch (action.type) {
        case ADD_TOAST:
            return [...state, payload];
        case REMOVE_TOAST:
            return state.filter(toast => toast.id !== payload.id);
        default:
            return state;
    }
}

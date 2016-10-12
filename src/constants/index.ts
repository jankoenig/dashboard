/*
 * AppConstants
 * These are the variables that determine what our central data store (reducer.js)
 * changes in our state. When you add a new action, you have to add a new constant here
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = "YOUR_ACTION_CONSTANT";
 */
export const CHANGE_FORM = "CHANGE_FORM";
export const SET_AUTH = "SET_AUTH";
export const SET_USER = "SET_USER";
export const SENDING_REQUEST = "SENDING_REQUEST";

export const LOGIN_USER_PENDING = "bst/LOGIN_USER_PENDING";
export const LOGIN_USER_SUCCESS = "bst/LOGIN_USER_SUCCESS";
export const LOGIN_USER_ERROR = "bst/LOGIN_USER_ERROR";
export const LOGOUT_USER = "bst/LOGOUT_USER";

export const INCREMENT_COUNTER = 'bst/INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'bst/DECREMENT_COUNTER';

import * as objectAssign from "object-assign";

import { CreateSourceError, CreateSourceRequest, CreateSourceSuccess, SetSourcesAction } from "../actions/source";
import {
    CREATE_SOURCE_ERROR,
    CREATE_SOURCE_REQUEST,
    CREATE_SOURCE_SUCCESS,
     SET_SOURCES
} from "../constants";
import Source from "../models/Source";

export type SourceState = {
    sources: Source[];
    currentSource: Source | undefined;
    newSource: Source | undefined;
    error: Error | undefined;
    sourceRequest: boolean;
}

const INITIAL_STATE: SourceState = {
    sources: [],
    currentSource: undefined,
    newSource: undefined,
    error: undefined,
    sourceRequest: false
};

type SourceAction = CreateSourceError | CreateSourceRequest | CreateSourceSuccess | SetSourcesAction | { type: "" };

export function source(state: SourceState = INITIAL_STATE, action: SourceAction): SourceState {

    switch (action.type) {
        case SET_SOURCES:
            console.log("setting sources");
            console.log(action.sources);
            return objectAssign({}, state, { sources: action.sources });
        case CREATE_SOURCE_REQUEST:
            return objectAssign({}, state, { sourceRequest: true });
        case CREATE_SOURCE_ERROR:
            return objectAssign({}, state, {error: action.error});
        case CREATE_SOURCE_SUCCESS:
            return objectAssign({}, state, {newSource: action.source});
        default:
            return state;
    }
}
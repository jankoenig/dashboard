import * as objectAssign from "object-assign";

import { CreateSourceError, CreateSourceRequest, CreateSourceSuccess, SetSources } from "../actions/source";
import {
    CREATE_SOURCE_ERROR,
    CREATE_SOURCE_REQUEST,
    CREATE_SOURCE_SUCCESS,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";

export type SourceState = {
    readonly sources: Source[];
    readonly newSource?: Source;
    readonly error?: Error;
    readonly sourceRequest: boolean;
}

const INITIAL_STATE: SourceState = {
    sources: [],
    sourceRequest: false
};

type SourceAction = CreateSourceError | CreateSourceRequest | CreateSourceSuccess | SetSources | { type: "" };

export function source(state: SourceState = INITIAL_STATE, action: SourceAction): SourceState {

    switch (action.type) {
        case SET_SOURCES:
            return objectAssign({}, state, { sources: action.sources });
        case CREATE_SOURCE_REQUEST:
            return objectAssign({}, state, { sourceRequest: true });
        case CREATE_SOURCE_ERROR:
            return objectAssign({}, state, { error: action.error });
        case CREATE_SOURCE_SUCCESS:
            let sources: Source[] = state.sources.slice();
            sources.push(action.source);
            return objectAssign({}, state, { sources: sources, newSource: action.source, sourceRequest: false });
        default:
            return state;
    }
}
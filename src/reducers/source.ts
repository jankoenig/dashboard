import * as objectAssign from "object-assign";

import { CreateSourceSuccess, SetCurrentSource, SetSources } from "../actions/source";
import {
    CREATE_SOURCE_SUCCESS,
    SET_CURRENT_SOURCE,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";

export type SourceState = {
    readonly currentSource?: Source;
    readonly sources: Source[];
    readonly error?: Error;
}

const INITIAL_STATE: SourceState = {
    sources: []
};

type SourceAction =  CreateSourceSuccess | SetCurrentSource | SetSources | { type: "" };

export function source(state: SourceState = INITIAL_STATE, action: SourceAction): SourceState {

    switch (action.type) {
        case SET_CURRENT_SOURCE:
            return objectAssign({}, state, { currentSource: action.source });
        case SET_SOURCES:
            return objectAssign({}, state, { sources: action.sources });
        case CREATE_SOURCE_SUCCESS:
            let sources: Source[] = state.sources.slice();
            sources.push(action.source);
            return objectAssign({}, state, { sources: sources });
        default:
            return state;
    }
}
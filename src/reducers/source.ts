import { CreateSourceSuccess, RemoveSource, SetCurrentSource, SetSources } from "../actions/source";
import {
    CREATE_SOURCE_SUCCESS,
    REMOVE_SOURCE,
    SET_CURRENT_SOURCE,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";

export type SourceState = {
    readonly currentSource?: Source;
    readonly sources: Source[];
    readonly error?: Error;
};

const INITIAL_STATE: SourceState = {
    sources: []
};

type SourceAction = CreateSourceSuccess | RemoveSource | SetCurrentSource | SetSources | { type: "" };

export function source(state: SourceState = INITIAL_STATE, action: SourceAction): SourceState {

    switch (action.type) {
        case SET_CURRENT_SOURCE: {
            return {...state, ...{ currentSource: action.source }};
        }

        case SET_SOURCES: {
            return {...state, ...{ sources: action.sources }};
        }

        case CREATE_SOURCE_SUCCESS: {
            let sources: Source[] = state.sources.slice();
            sources.push(action.source);
            return {...state, ...{ sources: sources }};
        }

        case REMOVE_SOURCE: {
            const sourceToRemove = action.source;

            // First remove from all the sources.
            let sources: Source[] = state.sources.slice();
            const index = sources.findIndex(function(value: Source, index: number, array: Source[]): boolean {
                return value.id === sourceToRemove.id;
            });
            if (index >= 0) {
                sources.splice(index, 1);
            }

            let currentSource = state.currentSource;
            // Then remove from the current source if it's already the current source.
            if (currentSource !== undefined && currentSource.id === sourceToRemove.id) {
                currentSource = undefined;
            }

            return { ...state, ...{ sources: sources, currentSource: currentSource }};
        }

        default:
            return state;
    }
}




import { CREATE_SOURCE_REQUEST, SET_CURRENT_SOURCE, SET_SOURCES } from "../constants";
import Source from "../models/source";

export type SetSourcesAction = {
    type: SET_SOURCES,
    sources: Source[]
}

export function setSources(sources: Source[]): SetSourcesAction {
    return {
        type: SET_SOURCES,
        sources: sources
    };
}

export type SetCurrentSourceAction = {
    type: SET_CURRENT_SOURCE,
    source: Source
}

export function setCurrentSource(source: Source): SetCurrentSourceAction {
    return {
        type: SET_CURRENT_SOURCE,
        source: source
    };
}


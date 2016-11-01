//  import * as objectAssign from "object-assign";

import Source from "../models/Source";

export type SourceState = {
    sources: Source[];
    currentSource: Source | undefined;
}

const INITIAL_STATE: SourceState = {
    sources: [],
    currentSource: undefined
};

export function source(state: SourceState = INITIAL_STATE, action: any) {
    console.log(INITIAL_STATE);
    switch (action.type) {
        default:
            return state;
    }
}
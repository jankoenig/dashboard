import * as Bluebird from "bluebird";
import {
    CREATE_SOURCE_SUCCESS,
    REMOVE_SOURCE,
    SET_CURRENT_SOURCE,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";
import service from "../services/source";

export type SetCurrentSource = {
    type: SET_CURRENT_SOURCE,
    source: Source
};

export type RemoveSource = {
    type: REMOVE_SOURCE,
    source: Source
};

export function setCurrentSource(source: Source): SetCurrentSource {
    return {
        type: SET_CURRENT_SOURCE,
        source: source
    };
}

export type SetSources = {
    type: SET_SOURCES,
    sources: Source[]
};

export function setSources(sources: Source[]): SetSources {
    return {
        type: SET_SOURCES,
        sources: sources
    };
}

export function removeSource(source: Source): RemoveSource {
    return {
        type: REMOVE_SOURCE,
        source: source
    };
}

export type CreateSourceSuccess = {
    type: CREATE_SOURCE_SUCCESS;
    source: Source;
};

export function createSourceSuccess(source: Source): CreateSourceSuccess {
    return {
        type: CREATE_SOURCE_SUCCESS,
        source: source
    };
}

export function deleteSource(source: Source): (dispatch: Redux.Dispatch<any>) => Promise<Source> {
    return function(dispatch: Redux.Dispatch<any>): Promise<Source> {
        return service.deleteSource(source)
            .then(function() {
                dispatch(removeSource(source));
                return source;
            });
    };
}

export function getSources(): (dispatch: Redux.Dispatch<any>) => Promise<Source[]> {
    return function(dispatch: Redux.Dispatch<any>): Promise<Source[]> {
        return new Promise((resolve, reject) => {
            service.getSources().then(function (retVal) {
                let promises: Bluebird<any>[] = [];
                let sources: Source[] = [];
                if (!retVal.val()) {
                    resolve(sources);
                } else {
                    let keys = Object.keys(retVal.val());
                    for (const k of keys) {
                        promises.push(Bluebird.resolve(service.getSource(k)));
                    }
                }
                Bluebird.all(promises.map((p) => p.reflect()))
                    .each((inspection: Bluebird.Inspection<any>) => {
                        if (inspection.isFulfilled()) {
                            sources.push(new Source(inspection.value().val()));
                        } else {
                            // comment for now until we cleanup the database
                            // console.log(inspection.reason());
                        }
                    })
                    .then(() => {
                        dispatch(setSources(sources));
                        resolve(sources);
                    });
            }).catch(err => reject(err));
        });
    };
}

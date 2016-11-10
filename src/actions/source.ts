import {
    CREATE_SOURCE_ERROR,
    CREATE_SOURCE_REQUEST,
    CREATE_SOURCE_SUCCESS,
    SET_CURRENT_SOURCE,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";
import service from "../services/source";

export type SetCurrentSource = {
    type: SET_CURRENT_SOURCE,
    source: Source
}

export function setCurrentSource(source: Source): SetCurrentSource {
    return {
        type: SET_CURRENT_SOURCE,
        source: source
    };
}

export type SetSources = {
    type: SET_SOURCES,
    sources: Source[]
}

export function setSources(sources: Source[]): SetSources {
    return {
        type: SET_SOURCES,
        sources: sources
    };
}

export function getSources(): Redux.ThunkAction<any, any, any> {
    return function (dispatch: Redux.Dispatch<any>) {
        service.getSources().then(function (retVal) {
            if (!retVal.val()) {
                dispatch(setSources([]));
            } else {
                let keys = Object.keys(retVal.val());
                let sources: Source[] = [];

                for (let key of keys) {
                    service.getSource(key).then(function (data) {
                        let newSource = new Source(data.val());
                        sources.push(newSource);
                        // Dispatch the array of sources, note the .slice() is to make
                        // a copy of the sources array.  This is needed otherwise redux
                        // will not recognize it is a new array coming and not update
                        // the components
                        dispatch(setSources(sources.slice()));
                    });
                }
            }
        });
    };
}

export type CreateSourceRequest = {
    type: CREATE_SOURCE_REQUEST
}

export function createSourceRequest(): CreateSourceRequest {
    return {
        type: CREATE_SOURCE_REQUEST
    };
}

export type CreateSourceSuccess = {
    type: CREATE_SOURCE_SUCCESS;
    source: Source;
}

export function createSourceSuccess(source: Source): CreateSourceSuccess {
    return {
        type: CREATE_SOURCE_SUCCESS,
        source: source
    };
}

export type CreateSourceError = {
    type: CREATE_SOURCE_ERROR,
    error: Error
}

export function createSourceError(error: Error): CreateSourceError {
    return {
        type: CREATE_SOURCE_ERROR,
        error: error
    };
}

export function createSource(source: Source): Redux.ThunkAction<any, any, any> {
    return function (dispatch: Redux.Dispatch<any>) {
        dispatch(createSourceRequest());
        return service.createSource(source).then(function (source: Source) {
            console.log("createSource().then().onResolve");
            console.log(source);
            dispatch(createSourceSuccess(source));
        }, function (error) {
            console.log("createSource().then().onReject");
            console.log(error);
            dispatch(createSourceError(error));
        });
    };
}


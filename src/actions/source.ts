import {
    CREATE_SOURCE_ERROR,
    CREATE_SOURCE_REQUEST,
    CREATE_SOURCE_SUCCESS,
    SET_CURRENT_SOURCE,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";
import service from "../services/source";

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
        return service.createSource(source).then(function (newSource) {
            console.log("new source callback");
            console.log(newSource);
            dispatch(createSourceSuccess(source));
        }, function (error) {
            dispatch(createSourceError(error));
        });
    };
}


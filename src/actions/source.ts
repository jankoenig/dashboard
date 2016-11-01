import { CREATE_SOURCE_REQUEST, SET_CURRENT_SOURCE, SET_SOURCES } from "../constants";
import Source from "../models/source";
import service  from "../services/source";

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

export function createSource(source: Source): Redux.ThunkAction<any, any, any> {
        console.log("action.createSource");
        return function (dispatch: Redux.Dispatch<any>) {
            console.log("inside dispatch functio");
            dispatch(createSourceRequest());
            service.createSource(source).then(function(newSource) {
                console.log("new source");
                console.log(newSource);
            }, function(error) {
                console.log("error");
                console.log(error);
            });
        };
}


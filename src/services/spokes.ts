import "isomorphic-fetch";

import Source from "../models/source";
import * as Spoke from "../models/spoke";
import User from "../models/User";

namespace spokes {

    const BASE_URL = "https://api.bespoken.link";

    export interface Lambda {
        lamdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };

    export interface HTTP {
        url: string;
    }

    /**
     * Returns a payload about the specified Pipe.
     */
    export function fetchPipe(source: Source): Promise<Spoke.Spoke> {
        const URL = BASE_URL + "/pipe/" + source.secretKey;
        return fetch(URL)
            .then(function (result: Response) {
                if (result.status === 200) {
                    return result.json();
                } else {
                    return Promise.reject(new Error("Spoke not found."));
                }
            }).then(function (result: FetchSpokeResponse) {
                scrub(result);
                return new FetchSpokeResponseObj(result);
            });
    }

    /**
     * creates a Spokes pipe which can be later retrieved from `fetchPipe`.
     * @param secret
     */
    export function savePipe(user: User, source: Source, resource: HTTP | Lambda, liveDebugging: boolean): Promise<Spoke.Spoke> {
        const URL = BASE_URL + "/pipe";
        const postObj = new SaveSpokeRequestObj(source, resource, liveDebugging);
        return fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": "Test Key",
                "x-access-userid": user.userId
            }, body: JSON.stringify(postObj)
        }).then(function (result: Response) {
                scrub(postObj);
                if (result.status === 200) {
                    return new FetchSpokeResponseObj(postObj);
                } else {
                    return Promise.reject("Could not save spoke.");
                }
            });
    }
}

export default spokes;

type PIPE_TYPE = Spoke.PIPE_TYPE;

interface FetchSpokeResponse {
    /**
     * Secret key of the skill.
     */
    uuid: string;
    /**
     * A unique diagnostic key for the skill. Currently the same as the secret key.
     */
    diagnosticKey: string;
    /**
     * The location that the skill would be retrieved from.
     */
    endPoint: {
        /**
         * Skill ID.
         */
        name: string;
    };
    /**
     * Spokes http endpoint
     */
    http?: {
        url: string;
    };
    /**
     * Spokes Lamda endpoint
     */
    lambda?: {
        lamdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };
    /**
     * Location to the pipe.
     */
    path: string;
    /**
     * Type of pipe this is.
     */
    pipeType: PIPE_TYPE;
    /**
     * True or false based on whether live debugging is enabled.
     */
    proxy: boolean;
}

interface SaveRequest {
    /**
     * Secret key of the skill.
     */
    uuid: string;
    /**
     * A unique diagnostic key for the skill. Currently the same as the secret key.
     */
    diagnosticKey: string;
    /**
     * The location that the skill would be retrieved from.
     */
    endPoint: {
        /**
         * Skill ID.
         */
        name: string;
    };
    /**
     * Spokes http endpoint
     */
    http?: {
        url: string;
    };
    /**
     * Spokes Lamda endpoint
     */
    lambda?: {
        lamdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };
    /**
     * Location to the pipe.
     */
    path: string;
    /**
     * Type of pipe this is.
     */
    pipeType: PIPE_TYPE;
    /**
     * True or false based on whether live debugging is enabled.
     */
    proxy: boolean;
}

/**
 * Removes objects from memory that we don't want.
 * @param response Removes object
 */
function scrub(response: FetchSpokeResponse | SaveRequest): void {
    response.lambda = undefined;
    response.http = undefined;
}

/**
 * There are certian items in the response that we do not want to keep in memory long (i.e. access keys).
 * So scrube those out.
 */
class FetchSpokeResponseObj implements Spoke.Spoke {
    uuid: string;
    diagnosticKey: string;
    endPoint: {
        name: string;
    };
    path: string;
    pipeType: PIPE_TYPE;
    proxy: boolean;

    constructor(response: FetchSpokeResponse | SaveSpokeRequestObj) {
        this.uuid = response.uuid;
        this.diagnosticKey = response.diagnosticKey;
        this.endPoint = response.endPoint;
        this.path = response.path;
        this.pipeType = response.pipeType;
        this.proxy = response.proxy;
    }
}

class SaveSpokeRequestObj implements SaveRequest {
    uuid: string;
    diagnosticKey: string;
    endPoint: {
        name: string;
    };
    http?: {
        url: string;
    };
    lambda?: {
        lamdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };
    path: string;
    pipeType: PIPE_TYPE;
    proxy: boolean;

    constructor(source: Source, resource: spokes.HTTP | spokes.Lambda, proxy: boolean = false) {
        this.uuid = source.secretKey;
        this.diagnosticKey = source.secretKey;
        this.endPoint = { name: source.id };
        this.path = "/"; // always this for now.
        this.proxy = proxy;
        if ((resource as spokes.HTTP).url) {
            this.pipeType = "HTTP";
            const res = resource as spokes.HTTP;
            this.http = {
                url: res.url
            };
        } else if ((resource as spokes.Lambda).lamdaARN) {
            this.pipeType = "LAMBDA";
            const res = resource as spokes.Lambda;
            this.lambda = {
                lamdaARN: res.lamdaARN,
                awsAccessKey: res.awsAccessKey,
                awsSecretKey: res.awsSecretKey
            };
        }
    }
}
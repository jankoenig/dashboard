import "isomorphic-fetch";

import Source from "../models/source";
import * as Spoke from "../models/spoke";
import User from "../models/user";

namespace spokes {

    const BASE_URL = "https://api.bespoken.link";

    export interface Lambda {
        lambdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };

    export interface HTTP {
        url: string;
    }

    /**
     * Returns a payload about the specified Pipe.
     */
    export function fetchPipe(user: User, source: Source): Promise<Spoke.Spoke> {
        const URL = BASE_URL + "/pipe/" + source.secretKey;
        return resolveUser(user)
            .then(function (user: User) {
                return fetch(URL, {
                    headers: {
                        "x-access-userid": user.userId,
                        "x-access-token": "4772616365-46696f72656c6c61",
                    }
                });
            }).then(function (result: Response) {
                return parse(result, "Spoke not found.");
            })
            .then(function (result: FetchSpokeResponse) {
                scrub(result);
                return new FetchSpokeResponseObj(result);
            });
    }

    function parse<T>(result: Response, errMsg: string = "Could not parse result."): T | Thenable<T> {
      console.log(result);
        if (result.status === 200) {
            return result.json();
        } else {
            return Promise.reject(new Error(errMsg));
        }
    }

    /**
     * creates a Spokes pipe which can be later retrieved from `fetchPipe`.
     * @param secret
     */
    export function savePipe(user: User, source: Source, resource: HTTP | Lambda, liveDebugging: boolean): Promise<Spoke.Spoke> {
        const URL = BASE_URL + "/pipe";
        let postObj: SaveSpokeRequestObj;
        return resolveSource(source)
            .then(function (source: Source) {
                postObj = new SaveSpokeRequestObj(source, resource, liveDebugging);
                return resolveUser(user);
            }).then(function (user: User) {
                return fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": "4772616365-46696f72656c6c61",
                        "x-access-userid": user.userId
                    },
                    body: JSON.stringify(postObj)
                });
            }).then(function (result: Response) {
                scrub(postObj);
                if (result.status === 200) {
                    return new FetchSpokeResponseObj(postObj);
                } else {
                    return Promise.reject("Could not save spoke.");
                }
            }).catch(function(err: Error) {
                console.error(err);
                throw err;
            });
    }
}

export default spokes;

type PIPE_TYPE = Spoke.PIPE_TYPE;

function resolveUser(user: User): Promise<User> {
    return new Promise((resolve: (obj: User) => void, reject: (err: Error) => void) => {
        if (user.userId) {
            resolve(user);
        } else {
            reject(new Error("User must have a valid user ID"));
        }
    });
}

function resolveSource(source: Source): Promise<Source> {
    return new Promise((resolve: (obj: Source) => void, reject: (err: Error) => void) => {
        if (!source || !source.secretKey || !source.id) {
            return reject(new Error("Source must be provided with key and id."));
        } else {
            return resolve(source);
        }
    });
}

interface FetchSpokeResponse {
    /**
     * Secret key of the skill.
     */
    uuid: string;
    /**
     * A unique diagnostic key for the skill. Currently the same as the secret key.
     */
    diagnosticsKey: string;
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
        lambdaARN: string;
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
    diagnosticsKey: string;
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
        lambdaARN: string;
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
    if (response.lambda) {
        response.lambda.awsSecretKey = undefined;
    }
}

/**
 * There are certian items in the response that we do not want to keep in memory long (i.e. access keys).
 * So scrube those out.
 */
class FetchSpokeResponseObj implements Spoke.Spoke {
    uuid: string;
    diagnosticsKey: string;
    endPoint: {
        name: string;
    };
    http: {
        url: string;
    };
    lambda: {
        lambdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };
    path: string;
    pipeType: PIPE_TYPE;
    proxy: boolean;

    constructor(response: FetchSpokeResponse | SaveSpokeRequestObj) {
        this.uuid = response.uuid;
        this.diagnosticsKey = response.diagnosticsKey;
        this.endPoint = response.endPoint;
        this.path = response.path;
        this.pipeType = response.pipeType;
        this.proxy = response.proxy;
        this.http = response.http;
        this.lambda = response.lambda;
    }
}

class SaveSpokeRequestObj implements SaveRequest {
    uuid: string;
    diagnosticsKey: string;
    endPoint: {
        name: string;
    };
    http?: {
        url: string;
    };
    lambda?: {
        lambdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };
    path: string;
    pipeType: PIPE_TYPE;
    proxy: boolean;

    constructor(source: Source, resource: spokes.HTTP | spokes.Lambda, proxy: boolean = false) {
        this.uuid = source.secretKey;
        this.diagnosticsKey = source.secretKey;
        this.endPoint = { name: source.id };
        this.path = "/"; // always this for now.
        this.proxy = proxy;
        if ((resource as spokes.HTTP).url) {
            this.pipeType = "HTTP";
            const res = resource as spokes.HTTP;
            this.http = {
                url: res.url
            };
        } else if ((resource as spokes.Lambda).lambdaARN) {
            this.pipeType = "LAMBDA";
            const res = resource as spokes.Lambda;
            this.lambda = {
                lambdaARN: res.lambdaARN,
                awsAccessKey: res.awsAccessKey,
                awsSecretKey: res.awsSecretKey
            };
        }
    }
}

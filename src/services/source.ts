// import * as Firebase from "firebase";
import "isomorphic-fetch";

import { Query } from "../models/query";
import { Source } from "../models/source";
// import StringUtil from "../utils/string";
import { remoteservice } from "./remote-service";

export namespace source {

    const NAME_GENERATING_URL: string = "http://ELB-ECS-SourceNameGenerator-dev-905620013.us-east-1.elb.amazonaws.com/v1/sourceId";

    export interface SourceName {
        id: string;
        secretKey: string;
    }

    /**
     * A function that will generate a unique source name.
     * @param id
     *      An id to check against.  If not provided, a random name will be supplied.
     */
    export function generateSourceId(id?: string): Promise<SourceName> {
        const query: Query = new Query();
        if (id) {
            query.add({ parameter: "id", value: id });
        }

        const finalURL = NAME_GENERATING_URL + "?" + query.query();

        const request = new Request(finalURL);
        console.info("Getting " + request.url);
        return fetch(finalURL)
               .then(function (result: any) {
                console.log(result);
                return result.json();
            }).then(function(result: SourceName) {
                console.log(result);
                return result;
            });
    }

    export function createSource(source: Source, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        let user = auth.currentUser;
        let ref = db.ref();
        let sourcesPath = ref.child("sources");
        // Create a new mutable source from the source passed in
        const mutableSource: any = { ...{}, ...source };
        return generateSourceId(source.id)
            .then(function (idResult: SourceName) {
                mutableSource.id = idResult.id;
                mutableSource.members[user.uid] = "owner";
                return mutableSource;
            }).then(function (source: Source) {
                return sourcesPath.child(source.id).set(source)
                    .then(function () {
                        // Save the source to the user's list of sources
                        return ref.child("users").child(user.uid).child("sources").child(source.id).set("owner");
                    });
            }).then(function () {
                // And finally provide it back to the callback
                console.log(mutableSource);
                return mutableSource;
            });
    }

    export function deleteSource(source: Source, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        const user = auth.currentUser;
        const ref = db.ref();
        const key = source.id;

        // tslint:disable:no-null-keyword
        return ref.child("users").child(user.uid).child("sources").child(key).set(null).then(function () {
            return removeMembers(user.uid, source);
        });
        // tslint:enable:no-null-keyword
    }

    export function getSources(auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let user = auth.currentUser;
        let ref = db.ref();
        return ref.child("/users/" + user.uid + "/sources").once("value");
    }

    export function getSourcesObj(auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source[]> {
        let user = auth.currentUser;
        let ref = db.ref();

        return ref.child("/users/" + user.uid + "/sources").once("value")
            .then(function (retVal) {
                return (retVal.val()) ? Object.keys(retVal.val()) : [];
            }).then(function (keys: string[]) {
                let getPromises: Promise<Source>[] = [];
                for (let key of keys) {
                    getPromises.push(getSourceObj(key, db));
                }
                return Promise.all(getPromises);
            });
    }

    export function getSource(key: string, db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let ref = db.ref();
        return ref.child("/sources/" + key).once("value");
    }

    export function getSourceObj(key: string, db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        return getSource(key, db)
            .then(function (data) {
                let source: Source = new Source(data.val());
                return source;
            });
    }
}

export default source;

function removeMembers(memeberId: string, source: Source): Promise<Source> {
    return new Promise(function (resolve, reject) {
        const mutableSource: any = { ...{}, ...source };
        mutableSource.members[memeberId] = undefined;
        resolve(mutableSource);
    });
}
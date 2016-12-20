import * as Firebase from "firebase";
import "isomorphic-fetch";
import * as objectAssign from "object-assign";

import { Source } from "../models/source";
import StringUtil from "../utils/string";
import { remoteservice  } from "./remote-service";

export namespace source {

    class MutableSource {
        secretKey: string;
        name: string;
        id: string;
        members: any;
        created: string;

        constructor(source: Source) {
            this.secretKey = source.secretKey;
            this.name = source.name;
            this.id = source.id;
            this.members = objectAssign({}, source.members);
            this.created = source.created.toISOString();
        }
    }

    export function createSource(source: Source, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        return new Promise(function (callback, reject) {

            // Create a new mutable source from the source passed in
            let mutableSource: MutableSource = new MutableSource(source);

            let user = auth.currentUser;
            let ref = db.ref();
            let sourcesPath = ref.child("sources");

            // Create the base key and initial key
            let baseKey = mutableSource.id;
            let key = baseKey;

            // Add the current user as the owner of the source.
            mutableSource.members[user.uid] = "owner";

            let count = 0;
            let appendLength = 5;

            // Want it to keep looping until we finally have a unique value.
            // This constantly pings the database until we have a key that doesn't exist.
            // Hopefully, it wouldn't take more than a couple iterations max.
            let renameAndTryAgain = function (): Firebase.Promise<any> {
                // Child exists, so do another with an appended key.
                ++count;
                if (count % 10 === 0) {
                    // Basically, if we've somehow gone 10 iterations because we're really
                    // popular and we keep getting collisions, then lengthen it.
                    ++appendLength;
                }

                // Update the key for later usage
                key = baseKey + "-" + StringUtil.randomString(appendLength);

                // If you can read it again with the new key, try again
                return sourcesPath.child(key).once("value")
                    .then(renameAndTryAgain)
                    .catch(setTheSource);
            };

            // When we think we found a good key, we now set the source
            // for the key.  If it fails, it generates and new key and
            // tries again.
            let setTheSource = function (): Firebase.Promise<any> {
                // Update the key with the final iteraction before saving
                mutableSource.id = key;
                return sourcesPath.child(key).set(mutableSource)
                    .then(function () {
                        // Save the source to the user's list of sources
                        ref.child("users").child(user.uid).child("sources").child(key).set("owner").then(function () {
                            // And finally provide it back to the callback
                            callback(mutableSource);
                        });
                    }).catch(renameAndTryAgain); // If it fails, keep trying
            };

            // This starts off the recursion
            // Try to read the value at the key to see if it exists
            sourcesPath.child(key).once("value")
                // If it does, we need to change the key and try again
                .then(renameAndTryAgain)
                // If it doesn't exist, it throws an error that it can't read it
                // and, we go ahead and set it
                .catch(setTheSource);
        });
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
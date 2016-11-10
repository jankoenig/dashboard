import Utils from "../utils/index";
import * as Firebase from "firebase";
import "isomorphic-fetch";
import * as objectAssign from "object-assign";

import { Source } from "../models/source";
import SourceProfile from "../models/source-profile";

export namespace source {

    class MutableSource {
        secretKey: string;
        name: string;
        id: string;
        members: any;
        profile?: SourceProfile;

        constructor(source: Source) {
            this.secretKey = source.secretKey;
            this.name = source.name;
            this.id = source.id;
            this.members = objectAssign({}, source.members);
            this.profile = source.profile;
        }
    }

    export function createSource(source: Source): Promise<Source> {
        return new Promise(function (callback, reject) {

            let mutableSource: MutableSource = new MutableSource(source);

            let user = Firebase.auth().currentUser;
            let db = Firebase.database().ref();
            let sourcesPath = db.child("sources");

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
                    // Basically, if we've somehow gone 10 iterations because we're really popular and we keep getting collisions, then lengthen it.
                    ++appendLength;
                }

                // Update the key for later usage
                key = baseKey + "-" + Utils.randomString(appendLength);

                // If you can read it again with the new key, try again
                return sourcesPath.child(key).once("value")
                    .then(renameAndTryAgain)
                    .catch(setTheSource);
            };

            // When we think we found a good key, we now set the source
            // for the key.  If it fails, it generates and new key and
            // tries again.
            let setTheSource = function (): Firebase.Promise<any> {
                // Update the key
                mutableSource.id = key;

                return sourcesPath.child(key).set(mutableSource)
                    .then(function () {
                        // Save the source to the user's list of sources
                        db.child("users").child(user.uid).child("sources").child(key).set("owner").then(function () {
                            // And finally provide it back to the callback
                            callback(mutableSource);
                        });
                    }).catch(renameAndTryAgain); // If it fails, keep trying
            };

            // Try to read the value at the key to see if it exists
            sourcesPath.child(key).once("value")
                // If it does, we need to change the key and try again
                .then(renameAndTryAgain)
                // If it doesn't exist, it throws an error that it can't read it
                // and, we go ahead and set it
                .catch(setTheSource);
        });
    }

    export function getSources(): Promise<any> {
        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();
        return db.child("/users/" + user.uid + "/sources").once("value");
    }

    export function getSource(key: string): Promise<any> {
        let db = Firebase.database().ref();
        return db.child("/sources/" + key).once("value");
    }
}

export default source;
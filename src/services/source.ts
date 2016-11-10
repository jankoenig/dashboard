import Utils from "../utils/index";
import * as Firebase from "firebase";
import "isomorphic-fetch";

import { Source, SourceProperties, } from "../models/source";

export namespace source {

    export function createSource(source: Source): Promise<Source> {
        return new Promise(function (callback, reject) {

            let user = Firebase.auth().currentUser;
            let db = Firebase.database().ref();
            let sourcesPath = db.child("sources");

            // Add the current user as the owner of the source.
            let sourceProps: SourceProperties = source.copyFromSource();
            sourceProps.members[user.uid] = "owner";
            source = new Source(sourceProps);

            let baseKey = source.slug;
            let key = baseKey;

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
                return sourcesPath.child(key).set(source)
                    .then(function () {
                        // Copy the old source into the new one,
                        // passing on the key used as the slug
                        let newSource = new Source({
                            secretKey: source.secretKey,
                            name: source.name,
                            slug: key
                        });
                        callback(newSource);
                    }).catch(renameAndTryAgain); // If it fails, keep tring
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
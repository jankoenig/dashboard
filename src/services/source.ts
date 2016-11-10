import Utils from "../utils/index";
import * as Firebase from "firebase";
import "isomorphic-fetch";

import { Source, SourceProperties, } from "../models/source";

export namespace source {

    export function createSource(source: Source): Promise<Source> {

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
        let keepTryingFunction = function (): Firebase.Promise<any> {
            // Child exists, so do another with an appended key.
            console.log("keep trying");

            ++count;
            if (count % 10 === 0) {
                // Basically, if we've somehow gone 10 iterations because we're really popular and we keep getting collisions, then lengthen it.
                ++appendLength;
            }

            // Update the key for later usage
            key = baseKey + "-" + Utils.randomString(appendLength);
            // If you can read it again with the new key, try again
            console.log("but this time with key " + key);
            return sourcesPath.child(key).once("value").then(keepTryingFunction).catch(timeToSetSourceFunction);
        };

        let timeToSetSourceFunction = function(): Firebase.Promise<any> {
            console.log("time to set the data for " + key);
            return sourcesPath.child(key).set(source).then(function() {
                console.log("I was able to set the data for key " + key);
                console.log("time to pass out the new source");
            }).catch(keepTryingFunction);
        };

        return new Promise(function (callback, reject) {

            // Try to read the value at the key to see if it exists
            console.log("here we go! let me see if " + key + " exists by trying to read it");
            sourcesPath.child(key).once("value")
                // The then block is for if it succeeds,
                // this means you need to try again with another value
                .then(function() {
                    console.log("it exists and I own it, i should...");
                    // data exists.  change the key and try again
                    return keepTryingFunction();
                }).catch(function (error) {
                    return timeToSetSourceFunction();
                    // The child doesn't exist, so now we can add it.
                    /* console.log(key + " doesn't exist, lets try to set it");
                    sourcesPath.child(key).set(source).then(function () {
                        console.log("I was able to set data at " + key);
                        console.log("time to return the new source object");
                    }).catch(function(error) {
                        // it didn't work, i should keep trying
                        console.log("dang, looks like somebody already has this key, i should...");
                        return keepTryingFunction();
                    }); */
                });
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
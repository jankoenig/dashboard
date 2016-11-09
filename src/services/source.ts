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
        slug: string;
        members: any;
        profile?: SourceProfile;

        constructor(source: Source) {
            this.secretKey = source.secretKey;
            this.name = source.name;
            this.slug = source.slug;
            this.members = objectAssign({}, source.members);
            this.profile = source.profile;
        }
    }

    export function createSource(source: Source): Firebase.Promise<void> {

        let mutableSource: MutableSource = new MutableSource(source);

        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();
        let sourcesPath = db.child("sources");

        let baseKey = mutableSource.slug;
        let key = baseKey;

        let count = 0;
        let appendLength = 5;
        // Want it to keep looping until we finally have a unique value.
        // This constantly pings the database until we have a key that doesn't exist.
        // Hopefully, it wouldn't take more than a couple iterations max.
        let keepTryingFunction = function(snapshot: firebase.database.DataSnapshot): Firebase.Promise<any> {
            // Child exists, so do another with an appended key.
            ++count;
            if (count % 10 === 0) {
                // Basically, if we've somehow gone 10 iterations because we're really popular and we keep getting collisions, then lengthen it.
                ++appendLength;
            }

            key = baseKey + "-" + Utils.randomString(appendLength);
            return sourcesPath.child(key).once("value").then(keepTryingFunction);
        };

        return sourcesPath.child(key).once("value")
        .then(keepTryingFunction)
        .catch(function() {
            // Add the current user as the owner of the source.
            mutableSource.members[user.uid] = "owner";
            mutableSource.slug = key;

            // Error callback.  The child doesn't exist, so now we can add it.
            return sourcesPath.child(key).set(mutableSource).then(function() {
                return db.child("users").child(user.uid).child("sources").child(key).set("owner");
            });
         });
    }

    export function getSources(): Firebase.Promise<any> {

        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();

        return db.child("/users/" + user.uid + "/sources").once("value");
    }

    export function getSource(key: string): Firebase.Promise<any> {

        let db = Firebase.database().ref();

        return db.child("/sources/" + key).once("value");
    }
}

export default source;
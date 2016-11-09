import * as Firebase from "firebase";
import "isomorphic-fetch";

import Source from "../models/source";

export namespace source {

    export function createSource(source: Source): Firebase.Promise<void> {

        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();
        let key = source.slug;

        return db.child("sources").child(key).once("value").then(function(snapshot) {
            // The child exists, return a default promise that returns true.
            console.info("RETURNING " + snapshot.val());
            return snapshot.val();
         }, function() {
            // Error callback.  The child doesn't exist, so now we can add it.
            console.info("Adding child.");
            return db.child("users").child(user.uid).child("sources").child(key).set("owner").then(function() {
                return db.child("sources").child(key).set(source);
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
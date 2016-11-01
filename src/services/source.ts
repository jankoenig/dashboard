import * as Firebase from "firebase";
import "isomorphic-fetch";

import Source from "../models/source";

export namespace source {

    export function createSource(source: Source): Firebase.Promise<void> {

        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();
        let key = db.child("/users/" + user.uid + "/sources").push().key;

        return db.child("/users/" + user.uid + "/sources/" + key).set("owner").then(function() {
            console.log(source);
            return db.child("/sources/" + key).set(source);
        });
    }

    export function getSources(): Firebase.Promise<void> {

        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();

        return db.child("/users/" + user.uid + "/sources").once("value");
    }
}

export default source;
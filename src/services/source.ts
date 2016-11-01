import * as Firebase from "firebase";
import "isomorphic-fetch";

import Source from "../models/source";

export namespace source {

    export function createSource(source: Source): Firebase.Promise<any> {
        console.log("service.createSource(`source`)");
        let user = Firebase.auth().currentUser;
        let db = Firebase.database().ref();
        let key = db.child("/users/" + user.uid + "/sources").push().key;

        console.log(user);
        console.log(key);

        return db.child("/users/" + user.uid + "/sources/" + key).set("owner").then(function() {
            console.log("first success");
            return db.child("/sources/" + key).set(source);
        });
    }
}

export default source;
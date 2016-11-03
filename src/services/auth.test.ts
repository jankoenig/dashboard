import auth from "./auth";
import * as sinon from "sinon";


describe("auth.ts", function () {
    describe("Successful signUpWithEmail with username and password", function() {
        let signUpWithEmail: Sinon.SinonStub;

        before("Stubbing auth namespace.", function() {
            signUpWithEmail = sinon.stub(auth, "signUpWithEmail", (email: string, password: string, confirmPassword: string, callback: (success: boolean, error?: string) => void) => {
                callback(true, undefined);
            });
        });

        after(function() {
            signUpWithEmail.restore();
        });

        it ("Tests the signUpWithEmail flow works properly on a successful username and password signUpWithEmail with a default signUpWithEmail strategy.", function() {
               auth.signUpWithEmail("testuser", "secretPassword", "secretPassword", (success: true, error: "") => void{});
        });
    });
 });
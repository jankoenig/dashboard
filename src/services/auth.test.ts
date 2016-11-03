import auth from "./auth";


describe("auth.ts", function () {
    describe("Successful signUpWithEmail with username and password", function() {
        it ("Tests the signUpWithEmail flow works properly on a successful username and password signUpWithEmail with a default signUpWithEmail strategy.", function() {
               auth.signUpWithEmail("testuser", "secretPassword", "secretPassword", (success: true, error: "") => void{});
        });
    });
 });
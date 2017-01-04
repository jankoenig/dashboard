import * as chai from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as sinon from "sinon";

import { AUTH_FORM_ERROR, SET_SNACKBAR_MESSAGE, SET_USER } from "../constants";
import User from "../models/user";
import auth from "../services/auth";
import * as session from "./session";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let expect = chai.expect;

let user = new User({
    email: "test@test.com",
    displayName: "TestyMcTestFace",
    photoUrl: undefined
});

describe("Session.ts", function () {
    describe("Session Actions", function () {
        it("sets the user", function () {
            let user = new User({ email: "email" });
            let initialState = {};

            let store = mockStore(initialState);
            store.dispatch(session.setUser(user));

            expect(store.getActions().length).to.equal(1);
            let action: any = store.getActions()[0];
            expect(action.type).to.equal(SET_USER);
        });
    });

    describe("ToPath callbacks", function () {
        it("Tests the toPath callback to ensure it goes to the appropriate location.", function () {
            // The callback should replace the current page to the base page "/TestPath".
            let callback = new session.ToPathCallback("/TestPath");
            let initialState = {};
            let store = mockStore(initialState);

            callback.loginSuccess(store.dispatch, new User({ email: "email" }));

            expect(store.getActions().length).to.equal(1);

            let action: any = store.getActions()[0];
            expect(action.payload.method).to.equal("replace"); // This is redux-route method which could change as that library changes.
            expect(action.payload.args[0]).to.equal("/TestPath");
        });
    });

    describe("Back callback", function () {
        it("Tests the Back method actually goes back to the previous age.", function () {
            // The callback should perform a "back" option.
            let callback = new session.BackCallback();
            let initialState = {};
            let store = mockStore(initialState);

            callback.loginSuccess(store.dispatch, new User({ email: "email" }));

            expect(store.getActions().length).to.equal(1);

            let action: any = store.getActions()[0];
            expect(action.payload.method).to.equal("goBack"); // This is redux-route method which could change as that library changes.
        });
    });

    describe("Successful login With Github", function () {

        let loginGithubStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function () {
            loginGithubStub = sinon.stub(auth, "loginWithGithub").returns(new Promise<User>((resolve, reject) => {
                resolve(user);
            }));

            setUserStub = sinon.stub(auth, "user", () => {
                return new User({ email: "testEmail" });
            });
        });

        after(function () {
            loginGithubStub.restore();
            setUserStub.restore();
        });

        it("Tests the login flow works properly on a successful github login with a default login strategy.", function () {
            return verifySuccessLogin("/#welcome", session.loginWithGithub());
        });

        it("Tests the login flow works properly on successful github login with overridden login strategy.", function () {
            return verifySuccessLogin("/NextPath", session.loginWithGithub(new session.ToPathCallback("/NextPath")));
        });
    });

    describe("Successful login with username and password", function () {

        let loginStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function () {
            loginStub = sinon.stub(auth, "login").returns(new Promise<User>((resolve, reject) => {
                resolve(user);
            }));

            setUserStub = sinon.stub(auth, "user", () => {
                return new User({ email: "testEmail" });
            });
        });

        after(function () {
            loginStub.restore();
            setUserStub.restore();
        });

        it("Tests the login flow works properly on a successful username and password login with a default login strategy.", function () {
            return verifySuccessLogin("/#welcome", session.login("testuser", "secretPassword"));
        });

        it("Tests the login flow works properly on successful username and password login with overridden login strategy.", function () {
            return verifySuccessLogin("/NextPath", session.login("testuser", "secretPassword", new session.ToPathCallback("/NextPath")));
        });
    });

    describe("Successful signUpWithEmail with username and password", function () {

        let signUpWithEmail: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function () {
            signUpWithEmail = sinon.stub(auth, "signUpWithEmail").returns(new Promise<any>((resolve, reject) => {
                resolve(true);
            }));

            setUserStub = sinon.stub(auth, "user", () => {
                return new User({ email: "testEmail" });
            });
        });

        after(function () {
            signUpWithEmail.restore();
            setUserStub.restore();
        });

        it("Tests the signUpWithEmail flow works properly on a successful username and password signUpWithEmail with a default signUpWithEmail strategy.", function () {
            return verifySuccessLogin("/#welcome", session.signUpWithEmail("testuser", "secretPassword", "secretPassword"));
        });

        it("Tests the signUpWithEmail flow works properly on successful username and password signUpWithEmail with overridden signUpWithEmail strategy.", function () {
            return verifySuccessLogin("/NextPath", session.signUpWithEmail("testuser", "secretPassword", "secretPassword", new session.ToPathCallback("/NextPath")));
        });
    });

    describe("Unsuccessful signUpWithEmail with username and password", function () {
        let signUpWithEmail: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function () {
            signUpWithEmail = sinon.stub(auth, "signUpWithEmail").returns(new Promise<any>((resolve, reject) => {
                console.info("THROWING AN ERROR");
                reject(new Error("Error failed do to requirements of the test."));
            }));

            setUserStub = sinon.stub(auth, "user", (): User => {
                return undefined;
            });
        });

        after(function () {
            signUpWithEmail.restore();
            setUserStub.restore();
        });

        it("Tests the login flow works properly on an unsuccessful signUpWithEmail attempt.", function () {
            return verifyUnsuccessfullLogin(session.signUpWithEmail("testAccount", "12345-", "12345-the-kind-of-password-an-idiot-would-have-on-his-luggage"));
        });
    });

    describe("Unsuccessful login with Github", function () {
        let loginStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function () {
            loginStub = sinon.stub(auth, "loginWithGithub").returns(new Promise<any>((resolve, reject) => {
                reject(new Error("Error failed do to requirements of the test."));
            }));

            setUserStub = sinon.stub(auth, "user", (): User => {
                return undefined;
            });
        });

        after(function () {
            loginStub.restore();
            setUserStub.restore();
        });

        it("Tests the login flow works properly on an unsuccessful login attempt.", function () {
            return verifyUnsuccessfullLogin(session.loginWithGithub());
        });
    });

    describe("Unsuccessful login with username and password", function () {
        let loginStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function () {
            loginStub = sinon.stub(auth, "login").returns(new Promise<any>((resolve, reject) => {
                reject(new Error("Error failed do to requirements of the test."));
            }));

            setUserStub = sinon.stub(auth, "user", (): User => {
                return undefined;
            });
        });

        after(function () {
            loginStub.restore();
            setUserStub.restore();
        });

        it("Tests the login flow works properly on an unsuccessful login attempt.", function () {
            return verifyUnsuccessfullLogin(session.login("testAccount@test.com", "12345-the-kind-of-password-an-idiot-would-have-on-his-luggage"));
        });
    });

    describe("Logout", function () {
        let logoutStub: Sinon.SinonStub;

        beforeEach("Stubbing auth logout.", function () {
            logoutStub = sinon.stub(auth, "logout").returns(new Promise<any>((resolve, reject) => {
                resolve("Can be anything.");
            }));
        });

        afterEach(function () {
            logoutStub.restore();
        });

        it("Verifies a successful logout actions with callback", function (done: MochaDone) {
            let initialState = {};
            let store = mockStore(initialState);

            store.dispatch(session.logout(function (success: boolean) {
                expect(success).to.be.true;
                expect(store.getActions().length).to.equal(2);

                let finalAction: any = store.getActions()[store.getActions().length - 1];
                expect(finalAction.payload.method).to.equal("push"); // This is redux-route method which could change as that library changes.
                expect(finalAction.payload.args[0]).to.equal("/login");
                done();
            }));
        });

        it("Verifies a successful logout actions with Promise", function () {
            let initialState = {};
            let store = mockStore(initialState);

            return store.dispatch(session.logout()).then(function() {
                expect(store.getActions().length).to.equal(2);

                let finalAction: any = store.getActions()[store.getActions().length - 1];
                expect(finalAction.payload.method).to.equal("push"); // This is redux-route method which could change as that library changes.
                expect(finalAction.payload.args[0]).to.equal("/login");
            });
        });

        it("Verifies an unsuccessful logout action with callback.", function (done: MochaDone) {
            logoutStub.restore();
            logoutStub = sinon.stub(auth, "logout").returns(new Promise<any>((resolve, reject) => {
                reject(new Error("Error per requirement of the test."));
            }));
            let initialState = {};
            let store = mockStore(initialState);

            store.dispatch(session.logout(function (success: boolean) {
                expect(success).to.be.false;
                expect(store.getActions().length).to.equal(0);
                logoutStub.restore();
                done();
            }));
        });

        it("Verifies an unsuccessful logout action with promise.", function () {
            logoutStub.restore();
            logoutStub = sinon.stub(auth, "logout").returns(new Promise<any>((resolve, reject) => {
                reject(new Error("Error per requirement of the test."));
            }));
            let initialState = {};
            let store = mockStore(initialState);

            return store.dispatch(session.logout()).then(function () {
                expect(store.getActions().length).to.equal(0);
                logoutStub.restore();
            }).catch(function (err: Error) {
                logoutStub.restore();
                throw err;
            });
        });
    });

    describe("resetPassword", function () {

        let sendResetPasswordEmailStub: Sinon.SinonStub;

        let successPromise = new Promise((resolve, reject) => {
            resolve("Success");
        });

        let failPromise = new Promise((resolve, reject) => {
            reject(new Error("Failure do to requirements of the test."));
        });

        afterEach(function () {
            sendResetPasswordEmailStub.restore();
        });

        it("sets snackbar on success", function (done: MochaDone) {

            let initialState = {};
            let store = mockStore(initialState);

            sendResetPasswordEmailStub = sinon.stub(auth, "sendResetPasswordEmail").returns(successPromise);

            store.dispatch(session.resetPassword("test@email.com", function (success: boolean) {
                let actions: any[] = store.getActions();
                expect(success).to.be.true;
                expect(actions.length).to.equal(1);
                expect(actions[0].type).to.equal(SET_SNACKBAR_MESSAGE);
                expect(actions[0].message).to.equal("Check your inbox!");
                done();
            }));
        });

        it("passes through the error on failure", function (done: MochaDone) {

            let initialState = {};
            let store = mockStore(initialState);

            sendResetPasswordEmailStub = sinon.stub(auth, "sendResetPasswordEmail").returns(failPromise);

            store.dispatch(session.resetPassword("test@email.com", function (success: boolean) {
                let actions: any[] = store.getActions();
                expect(success).to.be.false;
                expect(actions.length).to.equal(1);
                expect(actions[0].type).to.equal(AUTH_FORM_ERROR);
                expect(actions[0].error).to.equal("Failure do to requirements of the test.");
                done();
            }));
        });
    });

    function verifySuccessLogin(redirectPath: string, loginAction: (dispatch: Redux.Dispatch<any>) => Promise<User>): Promise<User> {
        let initialState = {};
        let store = mockStore(initialState);

        console.log(store);
        return loginAction(store.dispatch).then(function (user: User) {
            expect(store.getActions().length).to.greaterThan(0);

            // TODO: Right now these are assuming that the "setUserAction" and the "redirectAction" are the last two
            // actions being dispatched, but really what's important is that "setUser" is before the "redirect". This can be
            // generic.
            let setUserAction: any = store.getActions()[store.getActions().length - 2];
            let redirectAction: any = store.getActions()[store.getActions().length - 1];

            verifyUserAction(setUserAction);
            verifyReplaceAction(redirectAction, redirectPath);
            return user;
        });
    }

    function verifyUnsuccessfullLogin(loginAction: (dispatch: Redux.Dispatch<any>) => Promise<User>): Promise<void> {
        let initialState = {};
        let store = mockStore(initialState);

        return loginAction(store.dispatch)
            .catch(function(err: Error) {
                let actions = store.getActions() as any;
                expect(actions.length).to.equal(3);
                expect(actions[0].type).to.equal("SENDING_REQUEST");
                expect(actions[0].sending).to.equal(true);
                expect(actions[1].type).to.equal("SENDING_REQUEST");
                expect(actions[1].sending).to.equal(false);
                expect(actions[2].type).to.equal("bst/AUTH_FORM_ERROR");
                expect(actions[2].error).to.equal(err.message);
            });
    }

    function verifyUserAction(action: any) {
        expect(action.type).to.equal(SET_USER);
        expect(action.user.email).to.equal("testEmail");
    }

    function verifyReplaceAction(action: any, path: string) {
        expect(action.payload.method).to.equal("replace"); // This is redux-route method which could change as that library changes.
        expect(action.payload.args[0]).to.equal(path);
    }
});
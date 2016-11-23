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

it("Tests the login flow works properly on a successful github login with a default login strategy.", function (done: MochaDone) {
    verifySuccessLogin("/#welcome", (store: any) => {
        session.loginWithGithub()(store.dispatch);
        done();
    });
});

it("Tests the login flow works properly on successful github login with overridden login strategy.", function (done: MochaDone) {
    verifySuccessLogin("/NextPath", (store: any) => {
        session.loginWithGithub(new session.ToPathCallback("/NextPath"))(store.dispatch);
        done();
    });
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

    it("Tests the login flow works properly on a successful username and password login with a default login strategy.", function (done: MochaDone) {
        verifySuccessLogin("/#welcome", (store: any) => {
            session.login("testuser", "secretPassword")(store.dispatch);
            done();
        });
    });

    it("Tests the login flow works properly on successful username and password login with overridden login strategy.", function (done: MochaDone) {
        verifySuccessLogin("/NextPath", (store: any) => {
            session.login("testuser", "secretPassword", new session.ToPathCallback("/NextPath"))(store.dispatch);
            done();
        });
    });
});

describe("Successful signUpWithEmail with username and password", function () {

    let signUpWithEmail: Sinon.SinonStub;
    let setUserStub: Sinon.SinonStub;

    before("Stubbing auth namespace.", function () {
        signUpWithEmail = sinon.stub(auth, "signUpWithEmail", (email: string, password: string, confirmPassword: string, callback: (success: boolean, error?: string) => void) => {
            callback(true, undefined);
        });

        setUserStub = sinon.stub(auth, "user", () => {
            return new User({ email: "testEmail" });
        });
    });

    after(function () {
        signUpWithEmail.restore();
        setUserStub.restore();
    });

    it("Tests the signUpWithEmail flow works properly on a successful username and password signUpWithEmail with a default signUpWithEmail strategy.", function () {
        verifySuccessLogin("/#welcome", (store: any) => {
            session.signUpWithEmail("testuser", "secretPassword", "secretPassword")(store.dispatch);
        });
    });

    it("Tests the signUpWithEmail flow works properly on successful username and password signUpWithEmail with overridden signUpWithEmail strategy.", function () {
        verifySuccessLogin("/NextPath", (store: any) => {
            session.signUpWithEmail("testuser", "secretPassword", "secretPassword", new session.ToPathCallback("/NextPath"))(store.dispatch);
        });
    });
});

describe("Unsuccessful signUpWithEmail with username and password", function () {
    let signUpWithEmail: Sinon.SinonStub;
    let setUserStub: Sinon.SinonStub;

    before("Stubbing auth namespace.", function () {
        signUpWithEmail = sinon.stub(auth, "signUpWithEmail", (email: string, password: string, confirmPassword: string, callback: (success: boolean, error?: string) => void) => {
            callback(false, "signUpWithEmail error.");
        });

        setUserStub = sinon.stub(auth, "user", (): User => {
            return undefined;
        });
    });

    after(function () {
        signUpWithEmail.restore();
        setUserStub.restore();
    });

    it("Tests the login flow works properly on an unsuccessful signUpWithEmail attempt.", function () {
        verifyUnsuccessfullLogin(() => {
            session.signUpWithEmail("testAccount", "12345-", "12345-the-kind-of-password-an-idiot-would-have-on-his-luggage");
        });
    });
});

describe("Unsuccessful login with Github", function () {
    let loginStub: Sinon.SinonStub;
    let setUserStub: Sinon.SinonStub;

    before("Stubbing auth namespace.", function () {
        loginStub = sinon.stub(auth, "login", (email: string, password: string, callback: (success: boolean, error?: string) => void) => {
            callback(false, "Login error.");
        });

        setUserStub = sinon.stub(auth, "user", (): User => {
            return undefined;
        });
    });

    after(function () {
        loginStub.restore();
        setUserStub.restore();
    });

    it("Tests the login flow works properly on an unsuccessful login attempt.", function () {
        verifyUnsuccessfullLogin(() => {
            session.loginWithGithub();
        });
    });
});

describe("Unsuccessful login with username and password", function () {
    let loginStub: Sinon.SinonStub;
    let setUserStub: Sinon.SinonStub;

    before("Stubbing auth namespace.", function () {
        loginStub = sinon.stub(auth, "login", (email: string, password: string, callback: (success: boolean, error?: string) => void) => {
            callback(false, "Login error.");
        });

        setUserStub = sinon.stub(auth, "user", (): User => {
            return undefined;
        });
    });

    after(function () {
        loginStub.restore();
        setUserStub.restore();
    });

    it("Tests the login flow works properly on an unsuccessful login attempt.", function () {
        verifyUnsuccessfullLogin(() => {
            session.login("testAccount@test.com", "12345-the-kind-of-password-an-idiot-would-have-on-his-luggage");
        });
    });
});

describe("Logout", function () {
    let logoutStub: Sinon.SinonStub;

    before("Stubbing auth logout.", function () {
        logoutStub = sinon.stub(auth, "logout").returns(new Promise<any>((resolve, reject) => {
            resolve("Can be anything.");
        }));
    });

    after(function () {
        logoutStub.restore();
    });

    it("Verifies a successful logout actions.", function (done: MochaDone) {
        let initialState = {};
        let store = mockStore(initialState);

        store.dispatch(session.logout(function(success: boolean) {
            expect(store.getActions().length).to.equal(2);

            let finalAction: any = store.getActions()[store.getActions().length - 1];
            expect(finalAction.payload.method).to.equal("push"); // This is redux-route method which could change as that library changes.
            expect(finalAction.payload.args[0]).to.equal("/login");
            done();
        }));
    });
});

describe("resetPassword", function () {

    let sendResetPasswordEmailStub: Sinon.SinonStub;
    let stubSuccess: boolean;
    let stubError: string;

    before(function () {
        sendResetPasswordEmailStub = sinon.stub(auth, "sendResetPasswordEmail", (email: string, callback: (success: boolean, error?: string) => void) => {
            callback(stubSuccess, stubError);
        });
    });

    after(function () {
        sendResetPasswordEmailStub.restore();
        stubSuccess = false;
        stubError = undefined;
    });

    it("sets snackbar on success", function () {

        let initialState = {};
        let store = mockStore(initialState);
        stubSuccess = true;

        store.dispatch(session.resetPassword("test@email.com"));

        let actions: any[] = store.getActions();
        expect(actions.length).to.equal(1);
        expect(actions[0].type).to.equal(SET_SNACKBAR_MESSAGE);
        expect(actions[0].message).to.equal("Check your inbox!");
    });
    it("passes through the error on failure", function () {

        let initialState = {};
        let store = mockStore(initialState);
        stubSuccess = false;
        stubError = "error";

        store.dispatch(session.resetPassword("test@email.com"));

        let actions: any[] = store.getActions();
        expect(actions.length).to.equal(1);
        expect(actions[0].type).to.equal(AUTH_FORM_ERROR);
        expect(actions[0].error).to.equal("error");
    });
});

function verifySuccessLogin(redirectPath: string, loginAction: (store: any) => void) {
    let initialState = {};
    let store = mockStore(initialState);

    loginAction(store);

    expect(store.getActions().length).to.greaterThan(0);

    // TODO: Right now these are assuming that the "setUserAction" and the "redirectAction" are the last two
    // actions being dispatched, but really what's important is that "setUser" is before the "redirect". This can be
    // generic.
    let setUserAction: any = store.getActions()[store.getActions().length - 2];
    let redirectAction: any = store.getActions()[store.getActions().length - 1];

    verifyUserAction(setUserAction);
    verifyReplaceAction(redirectAction, redirectPath);
}

function verifyUnsuccessfullLogin(loginAction: (store: any) => void) {
    let initialState = {};
    let store = mockStore(initialState);

    loginAction(store);

    expect(store.getActions().length).to.equal(0);
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
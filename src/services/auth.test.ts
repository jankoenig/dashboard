import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import User from "../models/user";
import { MemoryCacheStorage } from "../store/local-storage";
import browser from "../utils/browser";
import auth from "./auth";
import remoteservice from "./remote-service";

chai.use(sinonChai);
let expect = chai.expect;

let user: remoteservice.user.User = {
    emailVerified: true,
    displayName: "testUsers",
    email: "test@testdomain.test",
    photoURL: undefined,
    providerId: "ABC123",
    uid: "ABCD1234567890"
};

let successRedirect = new Promise<any>((resolve, reject) => {
    resolve({
        success: true
    });
});
let successResult = new Promise<any>((resolve, reject) => {
    resolve({
        user: user
    });
});

let unsuccessfulRedirect = new Promise<any>((resolve, reject) => {
    reject(new Error("Error thrown from promise as per test requirement."));
});

let unsuccessfulResult = new Promise<any>((resolve, reject) => {
    reject(new Error("Error thrown from redirect as per test requirement."));
});

describe("Auth ts not mocked", function () {

    let localStorage: MemoryCacheStorage;
    let authService: remoteservice.auth.Auth = <remoteservice.auth.Auth>{};

    describe("Log in with github.", function () {

        let utilsStub: Sinon.SinonStub;

        before(function () {
            localStorage = new MemoryCacheStorage();

            utilsStub = sinon.stub(browser, "isMobileOrTablet").returns(true);
        });

        beforeEach(function () {
            authService = <remoteservice.auth.Auth>{}; // reseting all stubs.
        });

        afterEach(function () {
            localStorage.clear();
            utilsStub.reset();
        });

        after(function () {
            utilsStub.restore();
        });

        it("Tests a successful github login.", function () {
            utilsStub.restore();
            utilsStub = sinon.stub(browser, "isMobileOrTablet").returns(true);

            authService.signInWithRedirect = sinon.stub().returns(successRedirect);
            authService.getRedirectResult = sinon.stub().returns(successResult);

            return auth.loginWithGithub(authService, localStorage)
                .then(function(user: User) {
                    expect(user).to.not.be.undefined;
                    expect(localStorage.length).to.equal(1);
                    expect(authService.signInWithRedirect).to.be.calledOnce;
                    expect(authService.getRedirectResult).to.be.calledOnce;
            });
        });

        it("Tests a successful github login for pop-up condition.", function () {
            utilsStub.restore();
            utilsStub = sinon.stub(browser, "isMobileOrTablet").returns(false);

            authService.signInWithPopup = sinon.stub().returns(successResult);

            auth.loginWithGithub(authService, localStorage).then(function(user: User) {
                expect(user).to.not.be.undefined;
                expect(localStorage.length).to.equal(1);
                expect(authService.signInWithPopup).to.be.calledOnce;
            });
        });

        it("Tests an unsuccessful github login.", function () {
            utilsStub.restore();
            utilsStub = sinon.stub(browser, "isMobileOrTablet").returns(true);

            authService.getRedirectResult = sinon.stub().returns(unsuccessfulRedirect);
            authService.signInWithRedirect = sinon.stub().returns(unsuccessfulResult);

            auth.loginWithGithub(authService, localStorage).catch(function(err: Error) {
                expect(err).to.not.be.undefined;
                expect(localStorage.length).to.equal(0);
                expect(authService.signInWithRedirect).to.be.calledOnce;
                expect(authService.getRedirectResult).to.not.be.called;
            });
        });

        it("Tests a unsuccessful github login for pop-up condition.", function () {
            utilsStub.restore();
            utilsStub = sinon.stub(browser, "isMobileOrTablet").returns(false);

            authService.signInWithPopup = sinon.stub().returns(unsuccessfulResult);

            auth.loginWithGithub(authService, localStorage).catch(function(err: Error) {
                expect(err).to.not.be.undefined;
                expect(localStorage.length).to.equal(0);
                expect(authService.signInWithPopup).to.be.calledOnce;
            });
        });
    });

    describe("Login with email.", function () {

        afterEach(function() {
            localStorage.clear();
        });

        it("Tests successful login.", function() {
            authService.signInWithEmailAndPassword = sinon.stub().returns(successResult);

            let username = "testuser@test.com";
            let password = "12345: The kind of password an idiot would have on his briefcase";
            return auth.login(username, password, authService, localStorage).then(function(user: User) {
                expect(user).to.not.be.undefined;
                expect(authService.signInWithEmailAndPassword).to.be.calledOnce;
                expect(authService.signInWithEmailAndPassword).to.have.been.calledWith(username, password);
            });
        });

        it("Tests unsuccessful login.", function() {
            authService.signInWithEmailAndPassword = sinon.stub().returns(unsuccessfulResult);

            let username = "testuser@test.com";
            let password = "12345: The kind of password an idiot would have on his briefcase";
            return auth.login(username, password, authService, localStorage).catch(function(err: Error) {
                expect(err).to.not.be.undefined;
                expect(authService.signInWithEmailAndPassword).to.be.calledOnce;
                expect(authService.signInWithEmailAndPassword).to.have.been.calledWith(username, password);
            });
        });
    });

    describe("Test logout.", function() {
        let successPromise: Promise<any> = new Promise<any>((resolve, reject) => {
            resolve("Success callback per requirements of the test.");
        });
        let failPromise: Promise<any> = new Promise<any>((resolve, reject) => {
            reject(new Error("Error thrown per requirements of the test."));
        });

        beforeEach(function() {
            localStorage.setItem("user", JSON.stringify(user));
        });

        it ("Tests a successful logout.", function() {
            authService.signOut = sinon.stub().returns(successPromise);

            return auth.logout(authService, localStorage).then(function() {
                expect(localStorage.getItem("user")).to.be.null;
            });
        });

        it ("Tests a unsuccessful logout.", function() {
            authService.signOut = sinon.stub().returns(failPromise);

            return auth.logout(authService, localStorage).catch(function() {
                expect(localStorage.getItem("user")).to.not.be.null;
            });
        });
    });

    describe("Test get user.", function() {
        beforeEach(function() {
            localStorage.clear();
        });

        it ("Tests it gets the user from localStorage.", function() {
            localStorage.setItem("user", JSON.stringify(user));

            expect(auth.user(localStorage).displayName).equals(user.displayName);
        });

        it ("Tests it returns undefined when user doesn't exist.", function() {
            expect(auth.user(localStorage)).to.be.undefined;
        });
    });

    describe("Test \"sendResetPasswordEmail\".", function() {
        let successPromise: Promise<any> = new Promise<any>((resolve, reject) => {
            resolve("YAY");
        });
        let failPromise: Promise<any> = new Promise<any>((resolve, reject) => {
            reject(new Error("NO"));
        });

        it ("Tests a successful response.", function(done: MochaDone) {
            authService.sendPasswordResetEmail = sinon.stub().returns(successPromise);

            let username = "test@testdomain.com";
            auth.sendResetPasswordEmail(username, (success: boolean, error?: string) => {
                expect(success).to.be.true;
                expect(error).to.be.undefined;
                expect(authService.sendPasswordResetEmail).to.be.calledOnce;
                expect(authService.sendPasswordResetEmail).to.be.calledWith(username);
                done();
            }, authService);
        });

        it ("Tests a unsuccessful response.", function(done: MochaDone) {
            authService.sendPasswordResetEmail = sinon.stub().returns(failPromise);

            let username = "test@testdomain.com";
            auth.sendResetPasswordEmail(username, (success: boolean, error?: string) => {
                expect(success).to.be.false;
                expect(error).to.not.be.undefined;
                expect(authService.sendPasswordResetEmail).to.be.calledOnce;
                expect(authService.sendPasswordResetEmail).to.be.calledWith(username);
                done();
            }, authService);
        });
    });

    describe("Tests \"signUpWithEmail\".", function() {
        let userPromise = new Promise<remoteservice.user.User>((resolve, reject) => {
            resolve(user);
        });

        let badPromise = new Promise<any>((resolve, reject) => {
            reject(new Error("Error thrown per test requirement."));
        });

        it("Tests passwords do not match.", function(done: MochaDone) {
            auth.signUpWithEmail("firstemail@domain.com", "password", "secondPassword", (success: boolean, error?: string) => {
                expect(success).to.be.false;
                expect(error).to.not.be.undefined;
                done();
            }, authService, localStorage);
        });

        it("Tests password is too short.", function(done: MochaDone) {
            auth.signUpWithEmail("firstemail@domain.com", "2", "2", (success: boolean, error?: string) => {
                expect(success).to.be.false;
                expect(error).to.not.be.undefined;
                done();
            }, authService, localStorage);
        });

        it("Tests email invalid.", function(done: MochaDone) {
            auth.signUpWithEmail("firstemail", "1234567", "1234567", (success: boolean, error?: string) => {
                expect(success).to.be.false;
                expect(error).to.not.be.undefined;
                done();
            }, authService, localStorage);
        });

        it("Tests a successful creation.", function(done: MochaDone) {
            authService.createUserWithEmailAndPassword = sinon.stub().returns(userPromise);

            let userName = "testEmail@domain.com";
            let password = "password";
            auth.signUpWithEmail(userName, password, password, (success: boolean, error?: string) => {
                expect(success).to.be.true;
                expect(error).to.be.undefined;
                expect(authService.createUserWithEmailAndPassword).to.be.calledOnce;
                expect(authService.createUserWithEmailAndPassword).to.be.calledWith(userName, password);
                done();
            }, authService, localStorage);
        });

        it("Tests a unsuccessful creation.", function(done: MochaDone) {
            authService.createUserWithEmailAndPassword = sinon.stub().returns(badPromise);

            let userName = "testEmail@domain.com";
            let password = "password";
            auth.signUpWithEmail(userName, password, password, (success: boolean, error?: string) => {
                expect(success).to.be.false;
                expect(error).to.not.be.undefined;
                expect(authService.createUserWithEmailAndPassword).to.be.calledOnce;
                expect(authService.createUserWithEmailAndPassword).to.be.calledWith(userName, password);
                done();
            }, authService, localStorage);
        });
    });
});
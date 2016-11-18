import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { MemoryCacheStorage } from "../store/local-storage";
import utils from "../utils";
import auth from "./auth";
import remoteservice from "./remote-service";

chai.use(sinonChai);
let expect = chai.expect;

/**
 * TODO: We need to revisit these once we figure out how to mock Firebase
 */
describe("Auth ts not mocked", function () {
    describe("Log in with github.", function () {

        let localStorage: MemoryCacheStorage;
        let authService: remoteservice.auth.Auth = <remoteservice.auth.Auth>{};

        let utilsStub: Sinon.SinonStub;

        let user: remoteservice.user.User = {
            emailVerified: true,
            displayName: "testUsers",
            email: "test@testdomain.test",
            photoURL: undefined,
            providerId: "ABC123",
            uid: "ABCD1234567890"
        };

        let successPromise = new Promise<any>((resolve, reject) => {
            resolve(user);
        });
        let successRedirect = new Promise<any>((resolve, reject) => {
            resolve({
                user: user
            });
        });

        let unsuccessfulPromise = new Promise<any>((resolve, reject) => {
            reject(new Error("Error thrown from promise as per test requirement."));
        });

        let unsuccessfulRedirect = new Promise<any>((resolve, reject) => {
            reject(new Error("Error thrown from redirect as per test requirement."));
        });

        before(function () {
            localStorage = new MemoryCacheStorage();

            utilsStub = sinon.stub(utils, "isMobileOrTablet").returns(true);
        });

        afterEach(function () {
            localStorage.clear();
            utilsStub.reset();
        });

        after(function () {
            utilsStub.restore();
        });

        it("Tests a successful github login.", function (done: MochaDone) {
            authService.signInWithRedirect = sinon.stub().returns(successPromise);
            authService.signInWithPopup = sinon.stub().returns(successPromise);
            authService.getRedirectResult = sinon.stub().returns(successRedirect);

            auth.loginWithGithub((success: boolean, error?: string) => {
                expect(success).to.be.true;
                expect(error).to.be.undefined;
                expect(localStorage.length).to.equal(1);
                done();
            }, authService, localStorage);
        });

        it("Tests an unsuccessful github login.", function (done: MochaDone) {
            authService.signInWithRedirect = sinon.stub().returns(unsuccessfulPromise);
            authService.signInWithPopup = sinon.stub().returns(unsuccessfulPromise);
            authService.getRedirectResult = sinon.stub().returns(unsuccessfulRedirect);

            auth.loginWithGithub((success: boolean, error?: string) => {
                expect(success).to.be.false;
                expect(error).to.not.be.undefined;
                expect(localStorage.length).to.equal(0);
                done();
            }, authService, localStorage);
        });
    });

    // describe("sign up bad email", function() {
    //     it ("Test the sign up funct.", function() {
    //            auth.signUpWithEmail("testuser", "secretPassword", "secretPassword", (success: true, error: "") => void{});
    //     });
    // });
    // describe("sign up short passes", function() {
    //     it ("Test the sign up funct.", function() {
    //            auth.signUpWithEmail("testuser@testuser.com", "secr", "secr", (success: true, error: "") => void{});
    //     });
    // });
    // describe("sign up not matching passes", function() {
    //     it ("Test the sign up funct.", function() {
    //            auth.signUpWithEmail("testuser@testuser.com", "secradad", "secr", (success: true, error: "") => void{});
    //     });
    // });
});
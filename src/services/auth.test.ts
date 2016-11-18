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
    describe("Log in with github.", function() {

        let localStorage: MemoryCacheStorage;
        let authService: remoteservice.auth.Auth = <remoteservice.auth.Auth>{};

        let utilsStub: Sinon.SinonStub;

        before(function() {
            localStorage = new MemoryCacheStorage();

            let successPromise = new Promise<string>((resolve, reject) => {
                resolve("SUCESS");
            });
            let successRedirect = new Promise<any>((resolve, reject) => {
                resolve({user: {
                    displayName: "TestName",
                    email: "Test@TestDomain.test",
                    photoURL: undefined,
                    providerId: "ABC123",
                    uid: "ABC123456"
                }});
            });
            authService.signInWithRedirect = sinon.stub().returns(successPromise);
            authService.getRedirectResult = sinon.stub().returns(successRedirect);
            authService.signInWithPopup = sinon.stub().returns(successPromise);

            utilsStub = sinon.stub(utils, "isMobileOrTablet").returns(true);
        });

        afterEach(function() {
            localStorage.clear();
            utilsStub.reset();
        });

        after(function() {
            utilsStub.restore();
        });

        it ("Tests a successful github login.", function(done: MochaDone) {
            auth.loginWithGithub((success: boolean, error?: string) => {
                expect(success).to.be.true;
                expect(error).to.be.undefined;
                expect(localStorage.length).to.equal(1);
                done();
             }, authService, localStorage);
        });
    });

    describe("sign up bad email", function() {
        it ("Test the sign up funct.", function() {
               auth.signUpWithEmail("testuser", "secretPassword", "secretPassword", (success: true, error: "") => void{});
        });
    });
    describe("sign up short passes", function() {
        it ("Test the sign up funct.", function() {
               auth.signUpWithEmail("testuser@testuser.com", "secr", "secr", (success: true, error: "") => void{});
        });
    });
    describe("sign up not matching passes", function() {
        it ("Test the sign up funct.", function() {
               auth.signUpWithEmail("testuser@testuser.com", "secradad", "secr", (success: true, error: "") => void{});
        });
    });
 });
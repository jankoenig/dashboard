import * as Firebase from "firebase";
import * as ReactGA from "react-ga";

import { FirebaseUser } from "../models/user";
import User from "../models/user";
import { BrowserStorage, LocalStorage } from "../store/local-storage";
import utils from "../utils";
import { remoteservice } from "./remote-service";

/**
 * Auth Service
 */
namespace auth {

    export function loginWithGithub(callback: (success: boolean, error?: string) => void, auth?: remoteservice.auth.Auth, storage?: LocalStorage) {
        console.info("WOOOO");
        let provider = new remoteservice.auth.GithubAuthProvider();
        loginWithProvider(provider, callback, auth, storage);
    }

    function loginWithProvider(provider: remoteservice.auth.AuthProvider, callback: (success: boolean, error?: string) => void, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), storage?: LocalStorage): void {
        console.info("WOOOO 2");
        if (utils.isMobileOrTablet()) {
            // Use redirect to authenticate user if it's a mobile device
            console.info("WOOOO 3");
            auth.signInWithRedirect(provider)
            .then(function() {
                return auth.getRedirectResult();
            })
            .then(function (result) {
                authProviderSuccessHandler(result, callback, storage);
            }).catch(function (error) {
                console.info("WOOO 9");
                authProviderFailHandler(error, callback);
                console.info("WOOO 10");
            });
        } else {
            console.info("WOOOO  4");
            auth.signInWithPopup(provider).then(function (result) {
                authProviderSuccessHandler(result, callback, storage);
                // TODO: Potential error condition here that needs to be handled
            }).catch(function (error) {
                console.info("WOOO 7");
                authProviderFailHandler(error, callback);
            });
        }
    }

    function authProviderSuccessHandler(result: any, callback: (success: boolean, error?: string) => void, localStorage: LocalStorage = new BrowserStorage()) {
        console.info("WOOOO 5");
        if (result.user !== undefined) {
            console.info("WOOOO 6");
            ReactGA.event({
                category: "Authorization",
                action: "Login With Github"
            });
            let user: remoteservice.user.User = result.user;
            localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
        }

        callback(true);
    }

    function authProviderFailHandler(error: any, callback: (success: boolean, error?: string) => void) {
        console.info("WOOO 8");
        console.error("Error logging In: " + error.message);
        callback(false, error.message);
    }

    function validateEmail(email: string) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    export function signUpWithEmail(email: string, password: string, confirmPassword: string, callback: (success: boolean, error?: string) => void, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), localStorage: LocalStorage = new BrowserStorage()): void {

        let localError: string;
        if (password === confirmPassword) {
            if (password.length < 6) {
                localError = "Password needs to be at least 6 characters";
                callback(false, localError);
            }
            else {
                if (validateEmail(email)) {
                    auth.createUserWithEmailAndPassword(email, password)
                        .then(function (user: Firebase.User) {
                        ReactGA.event({
                            category: "Authorization",
                            action: "Signup With Email"
                        });
                        localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
                        callback(true);
                    }).catch(function (error) {
                        console.error("Error signing up: " + error.message);
                        callback(false, error.message);
                    });
                }
                else {
                    localError = "Enter a valid email";
                    callback(false, localError);
                }
            }
        }
        else {
            localError = "Passwords do not match.";
            callback(false, localError);
        }
    }

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void, localStorage: LocalStorage = new BrowserStorage()): void {
        Firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            console.error("Error logging In: " + error.message);
            callback(false, error.message);
        }).then(function (user: Firebase.User) {
            ReactGA.event({
                category: "Authorization",
                action: "Login With Email"
            });
            localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
            callback(true);
        });
    }

    export function logout(callback: (success: boolean, error?: string) => void, localStorage: LocalStorage = new BrowserStorage()): void {
        Firebase.auth().signOut().catch(function (error) {
            callback(false, error.message);
        }).then(function () {
            localStorage.removeItem("user");
            callback(true);
        });
    }

    export function user(localStorage: LocalStorage = new BrowserStorage()): User | undefined {
        return localStorage.getItem("user") ? new User(JSON.parse(localStorage.getItem("user"))) : undefined;
    }

    export function sendResetPasswordEmail(email: string, callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().sendPasswordResetEmail(email).then(function () {
            callback(true);
        }, function (error) {
            callback(false, error.message);
        });
    }
}

export default auth;

import * as Firebase from "firebase";
import * as ReactGA from "react-ga";

import { FirebaseUser } from "../models/user";
import User from "../models/user";
import utils from "../utils";

/**
 * Auth Service
 */
namespace auth {

    export function loginWithGithub(callback: (success: boolean, error?: string) => void) {
        let provider = new Firebase.auth.GithubAuthProvider();
        loginWithProvider(provider, callback);
    }

    function loginWithProvider(provider: firebase.auth.AuthProvider, callback: (success: boolean, error?: string) => void): void {
        if (utils.isMobileOrTablet()) {
            // Use redirect to authenticate user if it's a mobile device
            Firebase.auth().signInWithRedirect(provider);
            Firebase.auth().getRedirectResult().then(function (result) {
                authProviderSuccessHandler(result, callback);
            }).catch(function (error) {
                authProviderFailHandler(error, callback);
            });

        } else {
            Firebase.auth().signInWithPopup(provider).then(function (result) {
                authProviderSuccessHandler(result, callback);
                // TODO: Potential error condition here that needs to be handled
            }).catch(function (error) {
                authProviderFailHandler(error, callback);
            });
        }
    }

    function authProviderSuccessHandler(result: any, callback: (success: boolean, error?: string) => void) {
        if (result.user !== undefined) {
            ReactGA.event({
                category: "Authorization",
                action: "Login With Github"
            });
            let user: Firebase.User = result.user;
            localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
            callback(true);
        }
    }

    function authProviderFailHandler(error: any, callback: (success: boolean, error?: string) => void) {
        console.log("Error logging In: " + error.message);
        callback(false, error.message);
    }

    function validateEmail(email: string) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    export function signUpWithEmail(email: string, password: string, confirmPassword: string, callback: (success: boolean, error?: string) => void): void {

        let localError: string;
        if (password === confirmPassword) {
            if (password.length < 6) {
                localError = "Password needs to be at least 6 characters";
                callback(false, localError);
            }
            else {
                if (validateEmail(email)) {
                    Firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                        console.log("Error signing up: " + error.message);
                        callback(false, error.message);
                    }).then(function (user: Firebase.User) {
                        ReactGA.event({
                            category: "Authorization",
                            action: "Signup With Email"
                        });
                        localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
                        callback(true);
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

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            console.log("Error logging In: " + error.message);
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

    export function logout(callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().signOut().catch(function (error) {
            callback(false, error.message);
        }).then(function () {
            localStorage.removeItem("user");
            callback(true);
        });
    }

    export function user(): User | undefined {
        return localStorage.getItem("user") ? new User(JSON.parse(localStorage.getItem("user"))) : undefined;
    }
}

export default auth;

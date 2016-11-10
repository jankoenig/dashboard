import * as Firebase from "firebase";

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
                authSuccessHandler(result, callback);
            }).catch(function (error) {
                authFailHandler(error, callback);
            });

        } else {
            Firebase.auth().signInWithPopup(provider).then(function (result) {
                authSuccessHandler(result, callback);
                // TODO: Potential error condition here that needs to be handled
            }).catch(function (error) {
                authFailHandler(error, callback);
            });
        }
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

    function authSuccessHandler(result: any, callback: (success: boolean, error?: string) => void) {
        if (result.user !== undefined) {
            let user: Firebase.User = result.user;
            localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
            callback(true);
        }
    }

    function authFailHandler(error: any, callback: (success: boolean, error?: string) => void) {
        console.log("Error logging In: " + error.message);
        callback(false, error.message);
    }

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            console.log("Error logging In: " + error.message);
            callback(false, error.message);
        }).then(function (user: Firebase.User) {
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

    export function sendResetPasswordEmail(email: string, callback: (success: boolean, error?: string) => void): void {
        if (validateEmail(email)) {
            Firebase.auth().sendPasswordResetEmail(email).then(function(){
                callback(true, "Reset email has been sent!");
            }, function(error){
                callback(false, "No user record for this email");
            });

        } else {
            callback(false, "Please enter a valid email");
        }
    }
}

export default auth;

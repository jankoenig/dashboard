import * as ReactGA from "react-ga";

import { FirebaseUser } from "../models/user";
import User from "../models/user";
import { BrowserStorage, LocalStorage } from "../store/local-storage";
import browser from "../utils/browser";
import { remoteservice } from "./remote-service";

/**
 * Auth Service
 */
namespace auth {

    export function loginWithGithub(auth?: remoteservice.auth.Auth, storage?: LocalStorage): Promise<User> {
        let provider = new remoteservice.auth.GithubAuthProvider();
        return loginWithProvider(provider, auth, storage);
    }

    function loginWithProvider(provider: remoteservice.auth.AuthProvider, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), storage?: LocalStorage): Promise<User> {
        let firstPromise: Promise<User>;
        if (browser.isMobileOrTablet()) {
            firstPromise = auth.signInWithRedirect(provider)
                                .then(function (results: any) {
                                    return auth.getRedirectResult();
                                });
        } else {
            firstPromise = auth.signInWithPopup(provider);
        }

        firstPromise.then(function (result: any) {
            return authProviderSuccessHandler(result, storage);
        });
        return firstPromise;
    }

    function authProviderSuccessHandler(result: any, localStorage: LocalStorage = new BrowserStorage()): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            let user: User = undefined;
            if (result.user !== undefined) {
                ReactGA.event({
                    category: "Authorization",
                    action: "Login With Github"
                });
                user = new FirebaseUser(result.user);
                localStorage.setItem("user", JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error("Error returned trying to log in."));
            }
        });
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
                        .then(function (user: remoteservice.user.User) {
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

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), localStorage: LocalStorage = new BrowserStorage()): void {
        auth.signInWithEmailAndPassword(email, password)
            .then(function (user: remoteservice.user.User) {
                ReactGA.event({
                    category: "Authorization",
                    action: "Login With Email"
                });
                localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
                callback(true);
            }).catch(function (error) {
                console.error("Error logging In: " + error.message);
                callback(false, error.message);
            });
    }

    export function logout(callback: (success: boolean, error?: string) => void, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), localStorage: LocalStorage = new BrowserStorage()): void {
        auth.signOut().then(function () {
            localStorage.removeItem("user");
            callback(true);
        }).catch(function (error) {
            callback(false, error.message);
        });
    }

    export function user(localStorage: LocalStorage = new BrowserStorage()): User | undefined {
        return localStorage.getItem("user") ? new User(JSON.parse(localStorage.getItem("user"))) : undefined;
    }

    export function sendResetPasswordEmail(email: string, callback: (success: boolean, error?: string) => void, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth()): void {
        auth.sendPasswordResetEmail(email).then(function () {
            callback(true);
        }, function (error) {
            callback(false, error.message);
        });
    }
}

export default auth;

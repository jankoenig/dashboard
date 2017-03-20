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
            firstPromise = auth.signInWithRedirect(provider);
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
            if (result.user) {
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

    function validateEmail(email: string): Promise<any> {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return new Promise<any>(function(resolve, reject) {
            if (re.test(email)) {
                resolve(email);
            } else {
                reject(new Error("Email " + email + " is not a valid email."));
            }
        });
    }

    function validatePassword(password: string, confirmPassword: string): Promise<any> {
        let matchProm = new Promise<any>(function (resolve, reject) {
            if (password === confirmPassword) {
                resolve(password);
            } else {
                reject(new Error("Passwords do not match."));
            }
        });
        let sizeProm = new Promise<any>(function (resolve, reject) {
            if (password.length >= 6) {
                resolve(password);
            } else {
                reject(new Error("Password must be greater than five characters."));
            }
        });

        return Promise.all([matchProm, sizeProm]);
    }

    export function signUpWithEmail(email: string, password: string, confirmPassword: string, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), localStorage: LocalStorage = new BrowserStorage()): Promise<User> {
        return Promise.all([validateEmail(email), validatePassword(password, confirmPassword)])
            .then(function (result: any) {
                return auth.createUserWithEmailAndPassword(email, password);
            }).then(function (user: remoteservice.user.User) {
                ReactGA.event({
                    category: "Authorization",
                    action: "Signup With Email"
                });
                let modelUser: User = new FirebaseUser(user);
                localStorage.setItem("user", JSON.stringify(modelUser));
                return modelUser;
            });
    }

    export function login(email: string, password: string, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), localStorage: LocalStorage = new BrowserStorage()): Promise<User> {
        return auth.signInWithEmailAndPassword(email, password)
            .then(function (user: remoteservice.user.User) {
                ReactGA.event({
                    category: "Authorization",
                    action: "Login With Email"
                });
                let modelUser: User = new FirebaseUser(user);
                localStorage.setItem("user", JSON.stringify(modelUser));
                return modelUser;
            });
    }

    export function logout(auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), localStorage: LocalStorage = new BrowserStorage()): Promise<any> {
        return auth.signOut().then(function () {
            localStorage.removeItem("user");
        });
    }

    export function user(localStorage: LocalStorage = new BrowserStorage()): User | undefined {
        return localStorage.getItem("user") ? new User(JSON.parse(localStorage.getItem("user"))) : undefined;
    }

    export function sendResetPasswordEmail(email: string, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth()): Promise<any> {
        return auth.sendPasswordResetEmail(email);
    }
}

export default auth;

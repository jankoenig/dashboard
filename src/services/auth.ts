import User from "../models/user";

/**
 * Auth Service
 */
namespace auth {

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void): void {
        // Really simple auth right now, the string equals the password then you are set
        setTimeout(function () {
            if (email === password) {

                let user = new User({email: email, token: "dkfjakdlkjfkdjakslkdj"});
                localStorage.setItem("user", JSON.stringify(user));

                callback(true);
            } else {
                callback(false);
            }
        }, 750);
    }

    export function logout(): void {
        localStorage.removeItem("user");
    }

    export function loggedIn(): boolean {
        return !!localStorage.getItem("user");
    }

    export function token(): string | undefined {
        return this.user() ? this.user().token : undefined;
    }

    export function user(): User | undefined {
        return localStorage.getItem("user") ? new User(JSON.parse(localStorage.getItem("user"))) : undefined;
    }
}

export default auth;

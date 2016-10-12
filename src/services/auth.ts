
/**
 * Auth Service
 */
namespace auth {

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void) {
        // Really simple auth right now, the string equals the password then you are set
        setTimeout(function () {
            if (email === password) {
                localStorage.setItem("token", "abcdefghijk");
                callback(true);
            } else {
                callback(false);
            }
        }, 750);
    }

    export function logout() {
        localStorage.setItem("token", undefined);
    }

    export function loggedIn() {
        return !!localStorage.getItem("token");
    }

    export function token() {
        return localStorage.getItem("token");
    }
}

export default auth;

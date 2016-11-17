/**
 * RemoteService is the link between the world and the rest of the universe. The defaultService
 * provided is the concrete implementation of this link. The rest of the class is extensible for unit
 * testing so they can provide their own unique implementations.  This is useful for dependency injection
 * in which case the remote connections can be flaky.
 */
export namespace remoteservice {
    export interface Service {
        auth(): remoteservice.auth.Auth;
    }

    export function defaultService(): Service {
        return new FirebaseNamespace.FirebaseService();
    }
}

export namespace remoteservice.user {
    export interface User {
        emailVerified: boolean;
    }

    export interface UserInfo {
        displayName: string | undefined;
        email: string | undefined;
        photoURL: string | undefined;
        providerId: string;
        uid: string;
    }
}

export namespace remoteservice.auth {

    export class GithubAuthProvider implements AuthProvider {
        static readonly PROVIDER_GITHUB: "Github";
        readonly providerId: "Github";
    }

    export interface AuthCredential {
        readonly provider: string;
    }

    export interface AuthProvider {
        readonly providerId: string;
    }

    export interface Auth {
        currentUser: remoteservice.user.User | undefined;
        createUserWithEmailAndPassword(email: string, password: string): Promise<user.User>;
        signInWithRedirect(provider: AuthProvider): Promise<any>;
        getRedirectResult(): Promise<any>;
        signInWithPopup(provider: AuthProvider): Promise<any>;
    }
}

export default remoteservice;

/** Firebase implementation beyond this point **/

function getRemoteToFirebaseProvider(provider: remoteservice.auth.AuthProvider): firebase.auth.AuthProvider {
    switch (provider.providerId) {
        case remoteservice.auth.GithubAuthProvider.PROVIDER_GITHUB:
            return new firebase.auth.GithubAuthProvider;

        default:
            throw Error("Provider " + provider.providerId + " does not exist.");
    }
}

/**
 * Firebase implementation of the remote-service class.
 */
namespace FirebaseNamespace {
    export class FirebaseService implements remoteservice.Service {
        auth(): remoteservice.auth.Auth {
            return new FirebaseAuth(firebase.auth());
        };
    }
}

class FirebaseAuth implements remoteservice.auth.Auth {
    currentUser: remoteservice.user.User | undefined;
    auth: firebase.auth.Auth;

    constructor(auth: firebase.auth.Auth) {
        this.auth = auth;
    }
    createUserWithEmailAndPassword(email: string, password: string): Promise<remoteservice.user.User> {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    signInWithRedirect(provider: remoteservice.auth.AuthProvider): Promise<any> {
        return this.auth.signInWithRedirect(getRemoteToFirebaseProvider(provider));
    }

    getRedirectResult(): Promise<any> {
        return this.auth.getRedirectResult();
    };

    signInWithPopup(provider: remoteservice.auth.AuthProvider): Promise<any> {
        return this.auth.signInWithPopup(getRemoteToFirebaseProvider(provider));
    }
}
export class UserDetails {
    readonly silentEchoToken: string;
    readonly vendorID: string;
    readonly smAPIAccessToken: string;
    constructor(silentEchoToken: string, smAPIAccessToken: string, vendorID: string) {
        this.silentEchoToken = silentEchoToken;
        this.smAPIAccessToken = smAPIAccessToken;
        this.vendorID = vendorID;
    }
}

export interface UserProperties {
  readonly email: string;
  readonly userId?: string;
  readonly displayName: string;
  readonly photoURL: string;
  readonly showToast?: boolean;
}

export class User implements UserProperties {

  readonly userId: string;
  readonly email: string;
  readonly displayName: string;
  readonly photoURL: string;
  readonly showToast?: boolean;
  readonly providerId: string;
  readonly uid: string;

  constructor(props: UserProperties) {
    this.userId = props.userId;
    this.email = props.email;
    this.displayName = props.displayName;
    this.photoURL = props.photoURL;
    this.showToast = props.showToast;
  }
}

export default User;

import * as Firebase from "firebase";

export class FirebaseUser extends User {

  constructor(user: Firebase.UserInfo) {
    super({ userId: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL});
  }
}

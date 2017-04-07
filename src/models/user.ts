
export interface UserProperties {
  readonly email: string;
  readonly userId?: string;
  readonly displayName?: string;
  readonly photoUrl?: string;
}

export class User implements UserProperties {

  readonly userId: string;
  readonly email: string;
  readonly displayName?: string;
  readonly photoUrl?: string;

  constructor(props: UserProperties) {
    this.userId = props.userId;
    this.email = props.email;
    this.displayName = props.displayName;
    this.photoUrl = props.photoUrl;
  }
}

export default User;

import * as Firebase from "firebase";

export class FirebaseUser extends User {

  constructor(user: Firebase.UserInfo) {
    super({ userId: user.uid, email: user.email, displayName: user.displayName, photoUrl: user.photoURL});
  }
}
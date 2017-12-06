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
  readonly displayName?: string;
  readonly photoUrl?: string;
  emailVerified?: boolean;
}

export class User implements UserProperties {

  readonly userId: string;
  readonly email: string;
  readonly displayName?: string;
  readonly photoUrl?: string;
  emailVerified?: boolean;

  constructor(props: UserProperties) {
    this.userId = props.userId;
    this.email = props.email;
    this.displayName = props.displayName;
    this.photoUrl = props.photoUrl;
    this.emailVerified = props.emailVerified;
  }
}

export default User;

import { remoteservice } from "../services/remote-service";

export class FirebaseUser extends User {

  constructor(user: remoteservice.user.User) {
    super({ userId: user.uid, email: user.email, displayName: user.displayName, photoUrl: user.photoURL, emailVerified: user.emailVerified });
  }
}

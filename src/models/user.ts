import * as Firebase from "firebase";


export interface UserProperties {
  email: string;
  displayName?: string;
}

export default class User implements UserProperties {

  readonly email: string;

  readonly displayName?: string;

  constructor(props: UserProperties) {
    this.email = props.email;
    this.displayName = props.displayName;
  }
}

export class FirebaseUser extends User {

  constructor(user: Firebase.User) {
    super({email: user.email, displayName: user.displayName});
  }
}
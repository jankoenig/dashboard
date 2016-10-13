
export interface UserProperties {
  email: string;
  token: string;
}

class User implements UserProperties {

  readonly email: string;

  readonly token: string;

  constructor(props: UserProperties) {
    this.email = props.email;
    this.token = props.token;
  }

}

export default User;

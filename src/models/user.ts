
export interface UserProperties {
  email: string;
}

class User implements UserProperties {

  email: string;

  constructor(props?: UserProperties) {
    this.email = props.email;
  }

}

export default User;

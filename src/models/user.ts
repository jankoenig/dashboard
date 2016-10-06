
export interface UserProperties {
  email: string;
}

export class User implements UserProperties {

  email: string;

  constructor(props?: UserProperties) {
    this.email = props.email;
  }

}

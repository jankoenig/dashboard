/**
 * Authentication lib
 * @type {Object}
 */
export function token(): string | undefined {
  console.log('checking token');
  console.log(localStorage);
  return localStorage.getItem('token');
}

export function login(username: string, password: string, callback:(sucess: boolean) => void) {

  if (username === password) {
    localStorage.setItem('token', 'aaabbbccc');
    callback(true);
  } else {
    callback(false);
  }
}

/*
export default {

  login(username: string, password: string, callback: (success: boolean) => void) {
    // If there is a token in the localStorage, the user already is
    // authenticated
    if (this.loggedIn()) {
      callback(true);
      return;
    } else {
      console.log('could not login');
      //TODO add firebase login code
      callback(false);
    }
  },

  logout(callback: (success: boolean) => void) {
    //TODO: add firebase logout logic
    callback(true);
  },



  register(username: string, password: string, callback: (success: boolean) => void) {

    callback(true);
    //TODO: Add firebase user registration here
  },
  onChange() {}
}*/

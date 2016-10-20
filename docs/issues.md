## Typings, React & Redux

Typings and the React/Redux ecosystem is in a weird state right now.  The biggest problem is redux has official typings __however__ they are not compatible with the dt typings for react-redux.  Instead you have to use the dt redux for everything to work.   See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9611

## Firebase $ currentUser Race Condition

Firebase does not return a currentUser immediately after initialization.  This causes a problem when we need to know if a user exists when we bootstrap the app in `src/index.tsx`.

There appears to be solutions to make Firebase work better with Redux (for example (redux-react-firebase)[https://github.com/tiberiuc/redux-react-firebase]) however this makes the entire app tightly coupled to Firebase which is not a preference.

For now, the user will be stored in localStorage so it can be accessed quickly.  In the future, we might want to look at just integrating directly with firebase-app or firebase-auth.

## The /src/components/Icon Directory

If you are using the Github desktop client, it pulls in the platform [gitignore](https://github.com/github/gitignore/blob/master/Global/macOS.gitignore#L6), as a global gitignore file. It __should__ still allow files and folders that have `Icon` in the name but it isn't.

If you think you are having problems with this, check it with the following command:

```bash
$ git check-ignore -v path/to/suspected/ignored/file
```

To force add the file, type:
```bash
$ git add --forece path/to/gitignored/file
```

## Getting Started

Install, you know the drill.
```bash
$ npm install
```

## Commands

A complete list of all the scripts are found in the `package.json` file.

To run tests:
```bash
$ npm test
```

To run code coverage:
```bash
$ npm run coverage
```

To run the example app:
```bash
$ npm start
```

To clean the generated files:
```bash
$ npm run clean
```

## IDE

I recommend the [Atom](https://atom.io/) text editor.  It is free and with the community plugins you will get pretty close to the functionality of a full fledged IDE like WebStorm.

### Atom Recommended Packages

For TypeScript

- atom-typescript
- linter-tslint

For React

- react

In General

- terminal-plus
- auto-update-packages
- atom-beautify
- editorconfig
- file-type-icons

### Helpful Atom Commands

- Properly indent files - control - alt (option) - l 

## Resources

- [TypeScript: React & Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
- [React & Web Components](https://facebook.github.io/react/docs/webcomponents.html)
- [Working with React and TypeScript](http://blog.wolksoftware.com/working-with-react-and-typescript)
- [TO DO MVC - React and TypeScript](http://todomvc.com/examples/typescript-react/#/)

## References

### Typescript

- [TypeScript](https://www.typescriptlang.org/docs/tutorial.html)
- [Microsoft TypeScript Coding Guideline](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)
- [Interface Walkthrough](https://blogs.msdn.microsoft.com/typescript/2013/01/24/walkthrough-interfaces/)

### Typings

Typings allow you to use thirdparty libraries written in JavaScript within your TypeScript source.

To add new definitions:

```bash
$ typings install dt~react-mdl --global --save
```

### React

- [React](https://facebook.github.io/react/docs/getting-started.html)
- [Login-Flow](https://github.com/mxstbr/login-flow)
- [Parse Dashboard](https://github.com/ParsePlatform/parse-dashboard)

### Redux

- [todomvc-redux-react-typescript](https://github.com/jaysoo/todomvc-redux-react-typescript)
- [typescript-react-redux-starter](https://github.com/rangle/typescript-react-redux-starter)

### Developing

- [BrowserSync](https://www.browsersync.io/docs)

### Writing Tests

- [Mocha](http://mochajs.org/)
- [Chai](http://chaijs.com/api/)

## Found Issues

Typings and the React/Redux ecosystem is in a bad state right now.  The biggest problem is redux has official typings __however__ they are not compatible with the dt typings for react-redux.  Instead you have to use the dt redux for everything to work.   See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9611   


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

The two recommended IDEs are either [Atom](https://atom.io/) or [VSCode](https://code.visualstudio.com/download).  Both are free and with community plugins you will get pretty close to the functionality of a full fledged IDE like WebStorm.

### Atom 

#### Atom Recommended Packages

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

#### Helpful Commands

- Properly indent files --> control & alt (option) * l

### VSCode

Visual Studio Code already comes with all the necessary plugins for TypeScript.

#### Helpful Commands 

- Toggle the integrated terminal --> control & ` 
- Format Code (that is in focus) --> alt & shift & f

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
- [TypeScript, React and Redux](http://www.mattgreer.org/articles/typescript-react-and-redux/)
- [React and Redux with TypeScript](http://jaysoo.ca/2015/09/26/typed-react-and-redux/)
- [Typesafe Redux in TypeScript](http://michaellawrie.com/typesafe-redux-in-typescript)
- [TypeScript and Async Redux Actions](https://rjzaworski.com/2016/09/typescript-redux-async-actions)
- [React TypeScript Samples](https://github.com/Lemoncode/react-typescript-samples)

### Typings

Typings allow you to use thirdparty libraries written in JavaScript within your TypeScript source.

To add new definitions:

```bash
$ typings install dt~react-mdl --global --save
```

### React

- [React](https://facebook.github.io/react/docs/getting-started.html)
- [Login-Flow](https://github.com/mxstbr/login-flow)
  - Great example of a login workflow with React
- [Parse Dashboard](https://github.com/ParsePlatform/parse-dashboard)

### Redux

- [todomvc-redux-react-typescript](https://github.com/jaysoo/todomvc-redux-react-typescript)
- [typescript-react-redux-starter](https://github.com/rangle/typescript-react-redux-starter)

### Developing

- [BrowserSync](https://www.browsersync.io/docs)

### Writing Tests

- [Mocha](http://mochajs.org/)
  - Testing Framework
- [Chai](http://chaijs.com/api/)
  - BDD Framework, provides the `expect`

- [Typescript Mocha Webpack Demo](https://github.com/vintem/TypescriptMochaWebpackDemo)

## Found Issues

Typings and the React/Redux ecosystem is in a bad state right now.  The biggest problem is redux has official typings __however__ they are not compatible with the dt typings for react-redux.  Instead you have to use the dt redux for everything to work.   See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9611   

## Work in Progress

### CSS modules

CSS Modules allow you to keep the style close to the views.  Some features of TypeScript 2.0 allow this to be possible.  In order to get it working we need to get mocha running in the browser (nodejs only understands javascript files, not CSS files).  Best path forward seems to be the typed-css-modules-loader by Jimdo.

- [SO - Use CSS Modules in React Components With TypeScript](http://stackoverflow.com/questions/35014132/use-css-modules-in-react-components-with-typescript-built-by-webpack)
- [css-modules/webpack-demo](https://github.com/css-modules/webpack-demo)
- [css-modules/webpack-demo question](https://github.com/css-modules/css-modules/issues/61)
- [typed-css-modules](https://github.com/Quramy/typed-css-modules)
- [typed-css-modules Issue 2 - Webpack Loader](https://github.com/Quramy/typed-css-modules/issues/2)
- [typings-for-css-modules-loader](https://github.com/Jimdo/typings-for-css-modules-loader)
- [TypeScript 2.0 - Wildcard Character in Module Names](https://www.typescriptlang.org/docs/release-notes/typescript-2.0.html#wildcard-character-in-module-names)
- [TypeScript 2.0 - Shorthand Ambient Module Declarations](https://www.typescriptlang.org/docs/release-notes/typescript-2.0.html#shorthand-ambient-module-declarations)
- [Related TypeScript Issue 6615](https://github.com/Microsoft/TypeScript/issues/6615)
- [Related TypeScript Issue 2709](https://github.com/Microsoft/TypeScript/issues/2709)

## Build Tools

### Webpack

Webpack is a bit magical.  That fact that it handles so much of the build can be a bit confusing.

It converts the TypeScript to JavaScript (courtesy of the `ts-loader` package) and then bundles the JavaScript into one file.  It only bundles what is needed based on the imports specficied.

To build the bundle you can use:

```bash
$ webpack
```

Which is aliased with:

```bash
$ npm run build
```

You should not ever need to call this directly.  We handle this with the release scripts and you should not check in modifications to the `/dist` folder with your pull requests.

## Development Tools

### Running the harness with BrowserSync & Webpack Middleware

To preview the dashboard during development, we leverage [Browsersync](https://www.browsersync.io/) with [webpack middleware] (https://github.com/Browsersync/recipes/tree/master/recipes/webpack.typescript.react) to handle the builds.

To start the server:

```bash
$ npm start
```

Browsersync and Webpack will automatically rebuild the bundle and refresh the page for you whenever you make changes to your TypeScript.

### Testing

We test modules individually within using Node.js as the runtime environment.  Because we run the code in a Node.js environment, we will not have access to certain DOM global variables like `window`.  This requires that we mock these components for tests.  Enzyme, a testing utility for React, already mocks the DOM for us so we can test React components.  Our test framework is Mocha, which provides the structure for the tests and proper reporting.  For assertions (`expect()`...) we use [Chai](http://chaijs.com/) and mocks we use [SinonJS](http://sinonjs.org/).  Instead of using SinonJS for mocking the Redux store, we simply use ["redux-mock-store"](https://github.com/arnaudbenard/redux-mock-store).

To run the tests:

```bash
$ npm test
```

and to run the tests with coverage:

```bash
$ npm run coverage
```

For more information on testing, go [here](./docs/testing.md).

## Dependencies

Most of the runtime dependencies are packaged in with our bundle by Webpack.  We have a couple of large dependencies we do not bundle in and are instead brought in as global variables through `<script />` tags.  These are React, React-DOM, MDL CSS and MDL JS.

### Material Design Light (MDL)

Our base frontend framework is [Material Design Light](https://getmdl.io/) by Google.  Similar to what Bootstrap provides, MDL provides components and base styles for building a UI.

### React

React is the V of our MVC.  It provides a framework for building views that are reusable.  Some of our components are tightly coupled to our dependency on MDL, for example the Grid and Cell components.

We classify the components into three types; frames, pages, and components.

Frames are the highest level.  They frame what is on the screen and display pages, that are swapped in and out based on the URL.

Pages live in frames and consist of many components.  The pages are in charge of setting the data on the components.

The components are the indivual UI parts.  They have very little logic within them and are only in charge of displaying what is given to them.

### Redux

Redux is our app state store.  It can operate indepently of React however they go very well together.  All of the state for the entire app is shared within the Redux store.  The components, pages, or frames do not have any state, they just passed parts of the store and are updated when the store gets updated.

The store is updated by actions and reducers.  Actions are events that have a type and a peice of information.  The actions are then passed through the reducers who then create a new store based on the action type and information that is passed.
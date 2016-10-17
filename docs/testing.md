For unit testing, we leverage the following libraries:

- [Mocha](http://mochajs.org/) for our test framework
- [Chai Assertion Library](http://chaijs.com/api/bdd/) for nice chainable assertions.
- [Sinon.JS](http://sinonjs.org/) for spies and mocks
- [Sinon Chai](https://github.com/domenic/sinon-chai) extends Chai by adding assertions for Sinon
- [Enzyme](http://airbnb.io/enzyme/) to assist with testing React components
- [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) for mocking Redux

# Tips

With Mocha, if you ever just want to run one test, change `describe(` to `describe.only(`.

# References

- [Redux - Writing Tests](http://redux.js.org/docs/recipes/WritingTests.html)
- [redux-mock-store How to Use](https://github.com/arnaudbenard/redux-mock-store#how-to-use)

# Examples

- [TypeScript Mocha Webpack Demo](https://github.com/vintem/TypescriptMochaWebpackDemo)
- [TypeScript Testing Examples](https://github.com/remojansen/TypeScriptTestingExamples)


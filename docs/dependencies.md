## Notes on Updating Dependencies

You can quickly check if you have an update to dependencies by using `npm-check`

```
$ npm install -g npm-check
```

And then from the root of your project:

```
$ npm-check
```

### history

Currently we need to stay on the 3.X series as this is required by react-router 3.X series.  V4 of react-router will use V4 of history.

### react-toolbox

The type definitions for 1.3.4 are not working so we are staying on 1.3.3

### webpack

Upgrading to webpack v2 will be a little work as it has breaking changes.  The ticket is [#221](https://github.com/bespoken/dashboard/issues/221)

*  [Webpack 2 Announcement](https://medium.com/webpack/webpack-2-and-beyond-40520af9067f#.q53m8qo0f)
*  [Migration Guide](https://webpack.js.org/guides/migrating/)

### @types

We tried once with [#116](https://github.com/bespoken/dashboard/issues/116), it didn't go well.  We will need to try again in the future.

### typings-for-css-modules-loader

We had trouble with 1.4.0, had to stay on 1.0.0

### redux-persist

4.3.1 has implicit `any` type errors in the definitions.

### sass-loader

sass-loader v6 requires Webpack v2

### postcss-loader

postcss-loader v1 requires Webpack v2

### remap-istanbul

v0.8.0 throws a strict mode error.
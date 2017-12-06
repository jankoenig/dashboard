## Deployment

In order to deploy `bespoken/dashboard` to firebase:

### Development Environment
1. Create a [new git tag](https://github.com/bespoken/dashboard/releases/new) with the suffix `dev-`, Eg. `dev-new-feature`.
2. Once travis build successfully finishes, visit: https://dev-dashboard-bbcee.firebaseapp.com

### Production Environment
- At the moment deployment goes via: [https://github.com/bespoken/bespoken-tools-website](https://github.com/bespoken/bespoken-tools-website)
1. Create a [new git tag](https://github.com/bespoken/dashboard/releases/new) with the suffix `prod-`, Eg. `prod-2.0.0`
2. Once travis build successfully finishes for the newly created tag, it creates a pull request with the following title, Eg. `[CD]: v2.0.0`, then merge it.
4. In [https://github.com/bespoken/bespoken-tools-website](https://github.com/bespoken/bespoken-tools-website) edit the version of `bespoken-dashboard` within [`bower.json`](https://github.com/bespoken/bespoken-tools-website/blob/master/bower.json), Eg. `2.0.0`, then merge it.
5. Once travis build successfully finishes, visit: https://apps.bespoken.io/dashboard/

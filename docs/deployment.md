#### Deployment Steps

1. Go to [https://github.com/bespoken/dashboard/releases](https://github.com/bespoken/dashboard/releases) and create
a new tag, use the following syntax: `prod-2.0.2`, the last part after the dash character (-) is the number
to be used as the production build version.
2. Step 1 triggers a production build on Travis, after it successfully finishes, a GitHub pull request
is automatically created containing all the production build files.
3. Merge the PR created on Step 3.
4. In [https://github.com/bespoken/bespoken-tools-website](https://github.com/bespoken/bespoken-tools-website) edit the version of `bespoken-dashboard` within [`bower.json`](https://github.com/bespoken/bespoken-tools-website/blob/master/bower.json)
use the production build version of Step 1.
5. Create a new PR for the Step 4.
6. Merge the PR created in Step 5.
7. Done!, after build successfully finishes in Step 6, dashboard auto-deploy to production!

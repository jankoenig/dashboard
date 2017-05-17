#### Deployment Steps

1. Create a new branch on `bespoken/dashboard`, with a name equals the new version release.
2. `cd dashboard && npm version patch`
3. Update `bower.json`: change version number, matching the latest release from `package.json`
4. Create & merge a PR for the branch created on Step 1.
5. Create a new release on `bespoken/dashboard` matching the latest release version.
6. On `bespoken/poken-tools-website` update `bower.json` to match the release version from Step 3.
7. Create & merge a PR on `bespoken/poken-tools-website`.

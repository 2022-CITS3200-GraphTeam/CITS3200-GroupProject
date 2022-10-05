# CITS3200-GroupProject

## Links

[Admin Interface](./templates/admin_interface.html)

## Updating

To update the version on github pages, update the tag number in [consts.mjs](./components/qualtrics/consts.mjs) and [injectionLoader.mjs](./components/qualtrics/injectionLoader.mjs), tag that commit with the same version number, and then push to the `main` branch. Pushing to the `main` branch alone *will* update github pages, however qualtrics will not fetch the latest update without updating the tag versions in those two files.

Example update for [injectionLoader.mjs](./components/qualtrics/injectionLoader.mjs);

```js
// old (v1.1.0)
let modulePromise = import("https://cdn.jsdelivr.net/gh/2022-CITS3200-GraphTeam/CITS3200-GroupProject@v1.1.0/components/qualtrics/injection.min.mjs");
```

=>

```js
// new (v1.2.0)
let modulePromise = import("https://cdn.jsdelivr.net/gh/2022-CITS3200-GraphTeam/CITS3200-GroupProject@v1.2.0/components/qualtrics/injection.min.mjs");
```
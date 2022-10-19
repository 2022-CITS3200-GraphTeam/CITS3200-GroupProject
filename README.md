# CITS3200-GroupProject

# How To Use Admin Documentation
[Admin User Guide](https://github.com/2022-CITS3200-GraphTeam/CITS3200-GroupProject/files/9818108/Admin.Documentation.docx)

Link to admin interface: https://2022-cits3200-graphteam.github.io/CITS3200-GroupProject/templates/admin_interface.html

# Participant Documentation to insert into Qualtrics Survey

[Participant User Guide](https://github.com/2022-CITS3200-GraphTeam/CITS3200-GroupProject/files/9818127/CITS3200_Team.Graph.Manipulation.Tool.Participant.User.Guide_Danna.Torres.Bennz.Oct.2022.2.pdf)

## Links

[Admin Interface](./templates/admin_interface.html)

## Local Development

To make qualtrics fetch from your local files, instead of github, modify the urls in [consts.mjs](./components/qualtrics/consts.mjs) and [injectionLoader.mjs](./components/qualtrics/injectionLoader.mjs) to point to `"http://localhost:5500"` and `"http://localhost:5500/components/qualtrics/injection.mjs"` respectively. **This is also a required for running the end-to-end tests.**

## Running Tests

Jest and Puppeteer are used to do testing. To setup the tests, install and/or use node.js v16 or later (tested on v16.17.1 (lts gallium) and v18.11.0), and run `npm install` in the project root to set up the libraries. Once installed, `npm test` in the project root will run the unit and end-to-end tests. The end-to-end tests expect a local server serving the files at `http://localhost:5500` - see the [Local Development](#local-development) section for details. This can be changed if required by overwriting the `BASE_URL` in [consts.mjs](./components/qualtrics/consts.mjs).

Puppeteer mocks a chromium browser while the tests are being run. By default the browser is run in headless mode; this setting can be changed in [jest-puppeteer.config.mjs](./jest-puppeteer.config.mjs) to make the window appear if e.g. debugging tests.

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

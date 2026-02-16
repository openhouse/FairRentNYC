# fairrentnyc

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
  * This project is pinned to Node `20.11.1` via `.nvmrc`.
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)
* [Watchman](https://facebook.github.io/watchman/) (recommended for reliable file watching)

## Installation

* `git clone <repository-url>` this repository
* `cd fairrentnyc`
* `nvm install && nvm use` (or install Node `20.11.1` manually)
* `npm ci` (preferred for deterministic installs)
  * This runs `scripts/fetch-council-districts.js`, which clones
    `https://github.com/NewYorkCityCouncil/districts` into
    `node_modules/council-districts` using HTTPS (avoids blocked `git://`).
  * If you see optional dependency build errors on local machines, retry with
    `npm ci --omit=optional`.

## Running / Development

* `npm run start:dev` (or `ember serve`)
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).
* If Watchman is unavailable, use polling: `EMBER_CLI_DISABLE_WATCHMAN=1 ember serve`

### Mailchimp configuration

The signup form uses build-time environment variables (see `config/environment.js`):

* `MAILCHIMP_ACTION_URL` (full POST action URL)
* `MAILCHIMP_U` (Mailchimp `u` value)
* `MAILCHIMP_ID` (Mailchimp `id` value)
* `MAILCHIMP_BOT_FIELD` (hidden honeypot field name)
* `MAILCHIMP_FALLBACK_URL` (optional hosted signup link)
* `MAILCHIMP_SUCCESS_MESSAGE` (optional message shown under the form)

You can set these in a `.env` file (supported via `ember-cli-dotenv`) or as
environment variables in your deployment target.

### Event RSVP configuration

Set `EVENT_RSVP_URL` to control the RSVP button in the yellow announcement bar.
If unset, it links to `#join`.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `npm run build:browser` (production browser-only output)
* `npm run build` (production build used by FastBoot server)
* `npm start` (run FastBoot server from built `dist/`)

### Deploying (Dokku)

This app now deploys as a Node/FastBoot service so SSR is active in production
for SEO + social crawlers.

1) Create a staging app:

```
dokku apps:create fairrent-staging
dokku buildpacks:set fairrent-staging https://github.com/heroku/heroku-buildpack-nodejs.git
dokku config:set fairrent-staging NODE_ENV=production NPM_CONFIG_PRODUCTION=false \
  MAILCHIMP_ACTION_URL=... MAILCHIMP_U=... MAILCHIMP_ID=... EVENT_RSVP_URL=...
```

2) Add a remote and deploy:

```
git remote add dokku-staging dokku@<host>:fairrent-staging
git push dokku-staging feature/2026:master
```

3) Tail logs if needed:

```
dokku logs -t fairrent-staging
```

Repeat the same steps for production (swap app name + config values). The
runtime process is `npm start`, which launches `fastboot-server.js` via `Procfile` (`web: npm start`). Builds run through `heroku-postbuild`, which executes `npm run build` and then prunes dev dependencies.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

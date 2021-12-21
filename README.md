# strapi-provider-upload-rokka

## Overview
This provider makes it easy to integrate [rokka.io](https://rokka.io/) into your [Strapi](https://strapi.io) application.

## Features
- creation and deletion of source images
- source image user metadata

## Installation and setup
Install the module
```sh
npm i strapi-provider-upload-rokka --save
```

Enable the provider, by adding the following snippet to `config/plugins.js`

# For Strapi 3

```js
module.exports = ({ env }) => ({
  upload: {
    provider: 'rokka',
    providerOptions: {
      apiKey: env('ROKKA_API_KEY'),
      org: env('ROKKA_ORG'),
      orgUrl: env('ROKKA_ORG_URL'),
    },
  },
});
```

Copy (and adapt) the variables from `.env.example` to the `.env` file at the root of your Strapi application.

# For Strapi 4
```js
module.exports = ({ env }) => ({
  // ...
  upload: {
      config: {
          provider: 'strapi-provider-upload-rokka',
          providerOptions: {
              apiKey: env('ROKKA_API_KEY'),
              org: env('ROKKA_ORG'),
              orgUrl: env('ROKKA_ORG_URL'),
          },
      }
  },
});
```

Copy (and adapt) the variables from `.env.example` to the `.env` file at the root of your Strapi application.

You may also need to adapt the Content Security Policy in Strapi 4

Edit `config/middlewares.js` and replace `strapi::security` with 

```js
  {
   name:  'strapi::security',
    config: {
      contentSecurityPolicy:  {
        useDefaults: true,
        directives: {
          'img-src': ["https:", 'data:', 'blob:', "'self'"],
        },
      },
    }
  }
```

You can also disable `Enable responsive friendly upload` in your media library settings, otherwise you get the same image
with different sizes in rokka, which is not needed. Rokka handles the resizing for you.
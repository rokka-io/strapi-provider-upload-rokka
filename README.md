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

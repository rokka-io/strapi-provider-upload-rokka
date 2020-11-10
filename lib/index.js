module.exports = {
  provider: 'rokka',
  name: 'Rokka provider',
  init(options) {
    const rokka = require('rokka')({
      apiKey: options.apiKey
    });

    return {
      upload(file) {
        // TODO: investigate how to disable thumbnail upload
        if (file.name.startsWith('thumbnail_')) {
          return
        }

        const metadata = {
          'meta_user': {
            alt: file.alternativeText,
            caption: file.caption
          }
        }

        return rokka.sourceimages.create(options.org, file.name, file.buffer, metadata)
          .then((result) => {
            file.hash = result.body.items[0].hash
            file.url = options.orgUrl + 'dynamic/' + result.body.items[0].hash + '.' + result.body.items[0].format
          })
          .catch((err) => {}); // TODO: handle error
      },
      delete(file) {
        return rokka.sourceimages.delete(options.org, file.hash)
          .then((result) => {})
          .catch((err) => {}); // TODO: handle error
      },
    };
  },
};

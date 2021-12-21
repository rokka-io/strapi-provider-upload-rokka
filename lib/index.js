module.exports = {
  provider: 'rokka',
  name: 'Rokka provider',
  init(options) {
    const rokka = require('rokka')({
      apiKey: options.apiKey
    });

    return {
      upload(file) {
        const isThumbnail = file.name.startsWith('thumbnail_')
        // only upload thumbnails, if set in the config.
        // but it helps to generate previews in the media manager (or not make them downloading the
        // super big original).
        // Rokka could handle that, of course, but didn't find an easy way to do that without uploading
        // the thumbnail as its own image.
        if (isThumbnail && !options.uploadThumbnail === true) {
          return
        }

        const metadata = {
          'meta_user': {
            alt: file.alternativeText,
            caption: file.caption
            thumbnail: isThumbnail ? 'yes': 'no',
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

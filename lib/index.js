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
            caption: file.caption,
            uploadedby: 'strapi',
            thumbnail: isThumbnail ? 'yes': 'no',
            "array:albums": ['strapi'] // if you use https://rokka.io/gallery the pictures uploaded through this will be in there own album
          },
          // To prevent that we delete an image on rokka, when it's uploaded in two different medias, we set a so called
          // dynamic metadata version (https://rokka.io/documentation/references/dynamic-metadata.html#version )
          // So each uploaded image, even if it's the same binary, gets an unique hash and if we delete one
          // only that entry is deleted and not the others with the same binaries. And won't use more storage on
          // rokka's side.
          // file.hash seems to be different for each upload, even if the same binary is uploaded again
          'meta_dynamic': {
            version: {text: file.hash}
          }
        }

        return rokka.sourceimages.create(options.org, file.name, file.buffer, metadata)
          .then((result) => {
            const item = result.body.items[0]
            file.hash = item.short_hash //store the short hash, it just gives shorter urls
            // only use jpg or png as format endings in the url (maybe check what to do with pdf and videos)
            // done, so we can upload display them in the media manager if some exotic format
            const format = (item.format !== 'jpg' && item.format !== 'png') ? 'jpg' : item.format
            file.url = options.orgUrl + 'dynamic/o-af-1/' + item.short_hash + '.' + format
            // preview URL only seems to make sense for videos, but it doesn't hurt either
            file.previewUrl = options.orgUrl + 'dynamic/resize-width-200-height-200-mode-box/o-af-1/' + item.short_hash + '.jpg'
            //add some additional metadata for later use
            file.provider_metadata = {
              hash: item.hash,
              format: item.format,
              mimetype: item.mimetype
            }
          })
          .catch((err) => {
            throw new Error (`Error creating on rokka: ${JSON.stringify(err)}`);}
          );
      },
      delete(file) {
        return rokka.sourceimages.delete(options.org, file.hash)
          .then((result) => {})
          .catch((err) => {
            // It's fine to just log it and not throw an error
            console.log(`Error deleting on rokka: ${JSON.stringify(err)}`)
          });
      },
    };
  },
};

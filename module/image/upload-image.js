const cloudinary = require('cloudinary').v2;
const debug = require('debug')('app:upload-image');

const config = require('../../config');

cloudinary.config({
  cloud_name: config.get('cloudinary.user'),
  api_key: config.get('cloudinary.key'),
  api_secret: config.get('cloudinary.secret'),
  secure: true,
});

function uploadImage(id, mediaUrl, count) {
  debug(`uploading:${count}:${id}`);

  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      mediaUrl,
      {
        public_id: `feedmechicago/${id}`,
      },
      (error, result) => {
        if (error) {
          debug(error);
          resolve(error);
        } else {
          resolve(result);
        }
      },
    );
  });
}

module.exports = uploadImage;

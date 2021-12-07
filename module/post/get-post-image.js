const fs = require('fs');

const { PostModel } = require('./model');
const downloadImage = require('../image/download-image');

async function getPostImage(id) {
  const path = `./public/${id}.jpeg`;

  if (!fs.existsSync(path)) {
    const response = await PostModel.find({ id });

    if (!Array.isArray(response) || !response.length) {
      return null;
    }

    const { mediaUrl } = response[0];
    await downloadImage(mediaUrl, path);
  }

  return fs.readFileSync(path);
}

module.exports = getPostImage;

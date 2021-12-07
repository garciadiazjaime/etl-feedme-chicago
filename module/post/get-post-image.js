const fs = require('fs');
const fetch = require('node-fetch');
const debug = require('debug')('app:get-post-image');

const { PostModel } = require('./model');

async function downloadImage(mediaUrl, path) {
  debug(`downloading:${mediaUrl}`);

  const response = await fetch(mediaUrl);
  const buffer = await response.buffer();
  fs.writeFileSync(path, buffer);
}

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

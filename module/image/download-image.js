const fetch = require('node-fetch');
const fs = require('fs');
const debug = require('debug')('app:download-image');

async function downloadImage(mediaUrl, path) {
  if (fs.existsSync(path)) {
    return null;
  }

  debug(`downloading:${mediaUrl}`);

  const response = await fetch(mediaUrl);

  const buffer = await response.buffer();
  fs.writeFileSync(path, buffer);

  return debug(`saved:${path}`);
}

module.exports = downloadImage;

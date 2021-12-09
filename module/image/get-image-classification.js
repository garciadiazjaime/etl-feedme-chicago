const fetch = require('node-fetch');
const debug = require('debug')('app:classify-images');

const config = require('../../config');

async function getImageClassification(id, mediaUrl, count) {
  debug(`classifying:${count}:${id}`);

  const url = `${config.get('api.classification')}/image/classification?mediaUrl=${encodeURIComponent(mediaUrl)}`;
  const response = await fetch(url);
  const classification = await response.json();

  return classification;
}

module.exports = getImageClassification;

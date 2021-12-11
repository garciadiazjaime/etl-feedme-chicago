const fetch = require('node-fetch');

const config = require('../../config');

const API_URL = config.get('api.url');
const API_CLASSIFICATION_URL = config.get('api.classification');

async function ping() {
  await fetch(API_URL);
  await fetch(API_CLASSIFICATION_URL);
}

function isProd() {
  return config.get('env') === 'production';
}

module.exports = {
  ping,
  isProd,
};

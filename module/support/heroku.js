const fetch = require('node-fetch');

const config = require('../../config');

const API_URL = config.get('api.url');

async function ping() {
  await fetch(API_URL);
}

function isProd() {
  return config.get('env') === 'production';
}

module.exports = {
  ping,
  isProd,
};

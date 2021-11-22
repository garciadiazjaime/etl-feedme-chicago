const cron = require('node-cron');
const fetch = require('node-fetch');
const debug = require('debug')('app:cron');

const postETL = require('../instagram/post-etl');
const config = require('../../config');

const API_URL = config.get('api.url');

let count = 0;

async function setupCron(cookies, page, publicPath) {
  if (!cookies) {
    return debug('NO_COOKIES');
  }

  if (Array.isArray(cookies) && cookies.length) {
    debug('setting cookies');
    await page.setCookie(...cookies);
  }

  cron.schedule('7 */2 * * *', async () => {
    debug(`========JOB:${count}========`);

    await postETL(page, publicPath);

    count += 1;
  });

  cron.schedule('*/12 * * * *', async () => {
    await fetch(API_URL);
  });

  await fetch(API_URL);

  return postETL(page, publicPath);
}

module.exports = {
  setupCron,
};

const cron = require('node-cron');
const fetch = require('node-fetch');
const debug = require('debug')('app:cron');

const postETL = require('../instagram/post-etl');
const imageCron = require('../image/cron-entry');
const config = require('../../config');

const API_URL = config.get('api.url');

let count = 0;
let countImage = 0;

async function setupCron(cookies, page) {
  if (!cookies) {
    return debug('NO_COOKIES');
  }

  if (Array.isArray(cookies) && cookies.length) {
    debug('setting cookies');
    await page.setCookie(...cookies);
  }

  cron.schedule('7 */1 * * *', async () => {
    count += 1;
    debug(`========JOB:postETL:${count}========`);

    await postETL(page, count);
  });

  cron.schedule('19 */1 * * *', async () => {
    countImage += 1;
    debug(`========JOB:imageCron:${countImage}========`);

    await imageCron();
  });

  cron.schedule('*/12 * * * *', async () => {
    await fetch(API_URL);
  });

  await fetch(API_URL);

  await postETL(page, count);

  await imageCron();

  return null;
}

module.exports = {
  setupCron,
};

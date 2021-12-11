const cron = require('node-cron');
const debug = require('debug')('app:cron');

const postETL = require('../instagram/post-etl');
const imageCron = require('../image/cron-entry');
const { ping, isProd } = require('./heroku');

async function prodCron(cookies, page) {
  if (!isProd()) {
    return null;
  }

  if (!cookies) {
    return debug('NO_COOKIES');
  }

  if (Array.isArray(cookies) && cookies.length) {
    debug('setting cookies');
    await page.setCookie(...cookies);
  }

  let prodCount = 0;

  cron.schedule('7 */1 * * *', async () => {
    prodCount += 1;
    debug(`========JOB:postETL:${prodCount}========`);

    await postETL(page, prodCount);
  });

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  await ping();

  await postETL(page, prodCount);

  return null;
}

function localCron() {
  if (isProd()) {
    return null;
  }

  let countImage = 0;

  cron.schedule('19 */1 * * *', async () => {
    countImage += 1;
    debug(`========JOB:imageCron:${countImage}========`);

    await imageCron();
  });

  return null;
}

async function setupCron(cookies, page) {
  await prodCron(cookies, page);
  localCron();
}

module.exports = {
  setupCron,
};

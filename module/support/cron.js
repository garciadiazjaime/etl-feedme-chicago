const cron = require('node-cron');
const debug = require('debug')('app:cron');

const postCron = require('../instagram/cron-entry');
const { ping } = require('./heroku');

async function setupCron(cookies, page) {
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
    debug(`========JOB:postCron:${prodCount}========`);

    await postCron(page, prodCount);
  });

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  await ping();

  await postCron(page, prodCount);

  return debug('CRON_SETUP');
}

module.exports = {
  setupCron,
};

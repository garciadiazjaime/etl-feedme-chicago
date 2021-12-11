const cron = require('node-cron');
const debug = require('debug')('app:cron');

const postETL = require('../instagram/post-etl');
const { ping } = require('./heroku');

let count = 0;

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

  cron.schedule('*/12 * * * *', async () => {
    await ping();
  });

  await ping();

  await postETL(page, count);

  return null;
}

module.exports = {
  setupCron,
};

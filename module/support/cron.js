const cron = require('node-cron');
const debug = require('debug')('app:cron');

const login = require('../instagram/login');
const postCron = require('../instagram/cron-entry');
const publishCron = require('../instagram/cron-publish');
const { getPage } = require('./page');
const { ping } = require('./heroku');

async function setupCron() {
  const page = await getPage();
  const cookies = await login(page);

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

  cron.schedule('17 10 * * *', async () => {
    await publishCron();
  });

  await ping();

  await postCron(page, prodCount);

  return debug('CRON_SETUP');
}

module.exports = {
  setupCron,
};

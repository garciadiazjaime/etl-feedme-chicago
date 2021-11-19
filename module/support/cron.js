const cron = require('node-cron');
const postETL = require('../instagram/post-etl')
const debug = require('debug')('app:cron');

let count = 0

async function setupCron(cookies, page, publicPath) {
  if (!cookies) {
    return debug('NO_COOKIES')
  }

  cron.schedule('7 */4 * * *', async () => {
    debug(`running job ${count}`);

    await postETL(page, publicPath)

    count += 1
  });

  await postETL(page, publicPath)
}

module.exports = {
  setupCron
}

const cron = require('node-cron');
const debug = require('debug')('app:cron');

let count = 0

function setupCron(page, publicPath) {
  cron.schedule('* * * * *', async () => {
    debug(`running job ${count}`);

    const url = 'https://www.instagram.com/';
    await page.goto(url);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${publicPath}/instagram-${count}.png` });

    count = (count + 1) % 30
  });
}

module.exports = {
  setupCron
}

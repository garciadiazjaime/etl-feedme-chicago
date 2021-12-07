const config = require('../../config');

const secondsToWait = 1000 * (config.get('env') === 'production' ? 10 : 1);

async function waiter() {
  return new Promise((resolve) => {
    setInterval(() => {
      resolve();
    }, secondsToWait);
  });
}

module.exports = waiter;

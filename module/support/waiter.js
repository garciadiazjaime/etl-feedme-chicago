const secondsToWait = 1000 * 10;

async function waiter() {
  return new Promise((resolve) => {
    setInterval(() => {
      resolve();
    }, secondsToWait);
  });
}

module.exports = waiter;

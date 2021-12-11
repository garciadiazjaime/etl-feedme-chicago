const mapSeries = require('async/mapSeries');
const cron = require('node-cron');
const debug = require('debug')('app:cron-image');

const { openDB } = require('../support/database');
const getPosts = require('../post/get-posts-for-image-classification');
const getImageClassification = require('./get-image-classification');
const savePostClassification = require('../post/save-post-classification');
const waiter = require('../support/waiter');

async function classifyImages() {
  const posts = await getPosts();
  debug(`posts-to-classify:${posts.length}`);

  if (!Array.isArray(posts) || !posts.length) {
    return debug('NO_POSTS');
  }

  let count = 0;
  await mapSeries(posts, async (post) => {
    const { id, mediaUrl } = post;

    count += 1;
    const classification = await getImageClassification(id, mediaUrl, count);

    await savePostClassification(id, classification);

    await waiter();
  });

  return debug('done');
}

async function main() {
  await openDB();

  let count = 0;
  cron.schedule('19 * * * *', async () => {
    count += 1;
    debug(`========JOB:imageCron:${count}========`);

    await classifyImages();
  });

  await classifyImages();
}

main().then(() => {
  debug('cron setup');
});

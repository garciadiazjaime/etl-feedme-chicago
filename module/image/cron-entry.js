const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:cron-image');

const getPosts = require('../post/get-posts-for-image-classification');
const getImageClassification = require('./get-image-classification');
const savePostClassification = require('../post/save-post-classification');
const waiter = require('../support/waiter');

async function main() {
  const posts = await getPosts();
  debug(`posts-to-classify:${posts.length}:10`);

  if (!Array.isArray(posts) || !posts.length) {
    return null;
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

module.exports = main;

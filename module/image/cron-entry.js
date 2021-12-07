const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:cron-image');

const getPosts = require('../post/get-posts-for-image-classification');
const downloadImage = require('./download-image');
const getImageClassification = require('./get-image-classification');
const savePostClassification = require('../post/save-post-classification');
const waiter = require('../support/waiter');

async function main() {
  const posts = await getPosts();
  debug(`posts-to-classify:${posts.length}:10`);

  if (!Array.isArray(posts) || !posts.length) {
    return null;
  }

  await mapSeries(posts.slice(0, 10), async (post) => {
    const { id, mediaUrl } = post;

    const path = `./public/${id}.jpeg`;
    await downloadImage(mediaUrl, path);

    const classification = await getImageClassification(path);

    await savePostClassification(id, classification);

    await waiter();
  });

  return debug('done');
}

module.exports = main;

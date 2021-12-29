const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:cron-image');

const { PostModel } = require('../post/model');
const { openDB } = require('../support/database');
const getImageClassification = require('./get-image-classification');
const waiter = require('../support/waiter');

async function classifyImages(limit = 600) {
  const posts = await await PostModel
    .find({ classification: null })
    .sort({ createdAt: -1 });

  debug(`posts-to-classify:${limit}/${posts.length}`);

  if (!Array.isArray(posts) || !posts.length) {
    return debug('NO_POSTS');
  }

  let count = 0;
  await mapSeries(posts.slice(0, limit), async (post) => {
    const { id, imageUrl } = post;

    count += 1;
    const classification = await getImageClassification(id, imageUrl, count);

    post.classification = classification; // eslint-disable-line
    post.save();

    await waiter();
  });

  return debug('done');
}

async function main() {
  await openDB();

  await classifyImages();
}

if (require.main === module) {
  main().then(() => {
    debug('end');
  });
}

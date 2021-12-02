const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:load');

const { PostModel } = require('../post/model');
const { saveJSON } = require('../support/file');

async function load(posts, hashtag, count) {
  if (!Array.isArray(posts) || !posts.length) {
    return debug('NO_POSTS');
  }

  saveJSON(`load-${hashtag}-${count}`, posts);

  let newPostsCount = 0;

  await mapSeries(posts, async (post) => {
    const documents = await PostModel.countDocuments({ id: post.id });
    if (!documents) {
      newPostsCount += 1;
    }

    await PostModel.findOneAndUpdate({ id: post.id }, post, {
      upsert: true,
    });
  });

  return debug(`new posts:${newPostsCount}`);
}

module.exports = load;

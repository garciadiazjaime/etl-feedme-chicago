const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:load');

const { PostModel } = require('./model');

async function load(posts) {
  if (!Array.isArray(posts) || !posts.length) {
    debug('NO_POSTS');
  }

  let newPostsCount = 0;

  await mapSeries(posts, async (post) => {
    const count = await PostModel.countDocuments({ id: post.id });
    if (!count) {
      newPostsCount += 1;
    }

    await PostModel.findOneAndUpdate({ id: post.id }, post, {
      upsert: true,
    });
  });

  return newPostsCount;
}

module.exports = load;

const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:load');

const { PostModel } = require('./model');

async function load(posts) {
  if (!Array.isArray(posts) || !posts.length) {
    debug('NO_POSTS');
  }

  await mapSeries(posts, async (post) => {
    await PostModel.findOneAndUpdate({ id: post.id }, post, {
      upsert: true,
    });
  });
}

module.exports = load;

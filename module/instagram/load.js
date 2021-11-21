const fs = require('fs');

const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:load');

const { PostModel } = require('../post/model');

async function load(posts, hashtag, publicPath) {
  if (!Array.isArray(posts) || !posts.length) {
    return debug('NO_POSTS');
  }

  fs.writeFileSync(`${publicPath}/load-${hashtag}.json`, JSON.stringify(posts));

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

  return debug(`new posts:${newPostsCount}`);
}

module.exports = load;

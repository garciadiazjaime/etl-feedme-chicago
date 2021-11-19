const fs = require('fs');
const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:post-etl');

const postsFromHashtag = require('./posts-from-hashtag');
const { PostModel } = require('./model');
const config = require('../../config');

async function main(page, publicPath) {
  debug('============ start ============');
  const hashtags = config.get('instagram.hashtags').split(',');

  await mapSeries(hashtags, async (hashtag) => {
    debug(hashtag);

    const posts = await postsFromHashtag(hashtag, page, publicPath);
    fs.writeFileSync(`${publicPath}/post-etl-${hashtag}.json`, JSON.stringify(posts));

    if (!Array.isArray(posts) || !posts.length) {
      debug('NO_POSTS');
    }

    await mapSeries(posts, async (post) => {
      await PostModel.findOneAndUpdate({ id: post.id }, post, {
        upsert: true,
      });
    });
  });

  return debug('============ done ============');
}

module.exports = main;

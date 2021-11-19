const fs = require('fs');
const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:post-etl');

const postsFromHashtag = require('./posts-from-hashtag')
const config = require('../../config');

async function main(page, publicPath) {
  debug('============ start ============');
  const hashtags = config.get('instagram.hashtags').split(',');

  await mapSeries(hashtags, async (hashtag) => {
    debug(hashtag)

    const posts = await postsFromHashtag(hashtag, page, publicPath);
    fs.writeFileSync(`${publicPath}/post-etl-${hashtag}.json`, JSON.stringify(posts));
  });

  return debug('============ done ============');
}

module.exports = main;

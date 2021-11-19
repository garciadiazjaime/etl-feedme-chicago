const fs = require('fs');
const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:post-etl');

const extract = require('./extract');
const transform = require('./transform');
const load = require('./load');

const config = require('../../config');

async function main(page, publicPath) {
  debug('============ start ============');
  const hashtags = config.get('instagram.hashtags').split(',');

  await mapSeries(hashtags, async (hashtag) => {
    debug(hashtag);

    const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
    const html = await extract(page, url, publicPath);

    const posts = await transform(html, hashtag);

    fs.writeFileSync(`${publicPath}/post-etl-${hashtag}.json`, JSON.stringify(posts));
    await load(posts);
  });

  return debug('============ done ============');
}

module.exports = main;

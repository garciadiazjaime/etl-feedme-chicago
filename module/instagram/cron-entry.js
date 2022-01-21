const mapSeries = require('async/mapSeries');

const extract = require('./extract');
const transform = require('./transform');
const load = require('./load');

const config = require('../../config');

async function main(page, count = 0) {
  const hashtags = config.get('instagram.hashtags').split(',');

  await mapSeries(hashtags, async (hashtag) => {
    const url = `https://www.instagram.com/explore/tags/${hashtag}/`;

    const html = await extract(page, url, count);
    const posts = await transform(html, hashtag, count, page);
    await load(posts, hashtag, count);
  });
}

module.exports = main;

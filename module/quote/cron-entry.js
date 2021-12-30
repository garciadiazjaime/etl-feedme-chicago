const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:quote-cron');

const extract = require('./extract');
const { QuoteModel } = require('./model');

const getPostPreview = require('../post/get-post-preview');

function getQueryFromPreview(postPreview) {
  if (!Array.isArray(postPreview.posts) || !postPreview.posts.length) {
    const { classification } = postPreview.posts[0];

    if (!Array.isArray(classification) || !classification.length) {
      return null;
    }
  }

  return postPreview.posts[0].classification[0].className.split(',')[0];
}

async function savedQuotes(query) {
  const documents = await QuoteModel.find({ query }).count();
  if (documents > 0) {
    return debug(`already-saved:${query}`);
  }

  const quotes = await extract(query);

  await mapSeries(quotes, async (quote) => {
    await new QuoteModel({
      text: quote[0],
      author: quote[1],
      query,
    }).save();
  });

  return debug(`${quotes.length}:saved`);
}

async function main() {
  const postPreview = await getPostPreview();

  const query = getQueryFromPreview(postPreview);

  return savedQuotes(query);
}

module.exports = main;
module.exports.savedQuotes = savedQuotes;

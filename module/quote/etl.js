const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:quote-cron');

const extract = require('./extract');
const { QuoteModel } = require('./model');

async function quoteETL(query) {
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

module.exports = quoteETL;

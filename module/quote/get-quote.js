const { QuoteModel } = require('./model');
const quoteETL = require('./etl');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getQuote(query) {
  let quotes = await QuoteModel.find({ query });

  if (quotes.length) {
    const index = getRandomInt(quotes.length);
    return quotes[index];
  }

  await quoteETL(query);

  quotes = await QuoteModel.find({ query });

  if (quotes.length) {
    const index = getRandomInt(quotes.length);
    return quotes[index];
  }

  return null;
}

module.exports = getQuote;

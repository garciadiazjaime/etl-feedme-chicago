const { QuoteModel } = require('./model');
const { savedQuotes } = require('./cron-entry');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getQuote(query) {
  let quotes = await QuoteModel.find({ query });

  if (quotes.length) {
    const index = getRandomInt(quotes.length);
    return quotes[index];
  }

  await savedQuotes(query);

  quotes = await QuoteModel.find({ query });

  if (quotes.length) {
    const index = getRandomInt(quotes.length);
    return quotes[index];
  }

  return null;
}

module.exports = getQuote;

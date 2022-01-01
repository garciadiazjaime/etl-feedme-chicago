const puppeteer = require('puppeteer');
const debug = require('debug')('app:brainyquote');

async function getQuote(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `https://www.brainyquote.com/search_results?q=${query}`;
  await page.goto(url);
  debug(url);

  const result = await page.evaluate(() => {
    const quotes = [];
    document.querySelectorAll('#quotesList .grid-item').forEach((item) => {
      if (item.innerText && item.innerText.length) {
        quotes.push(item.innerText.split(/\n/));
      }
    });
    return quotes;
  });

  await browser.close();

  return result;
}

module.exports = getQuote;

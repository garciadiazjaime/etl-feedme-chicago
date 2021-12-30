const puppeteer = require('puppeteer');

async function getQuote() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const query = encodeURIComponent('ice cream');
  await page.goto(`https://www.brainyquote.com/search_results?q=${query}`);

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

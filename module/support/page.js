const puppeteer = require('puppeteer');

async function getPage() {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();

  return page;
}

module.exports = {
  getPage,
};

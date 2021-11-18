const express = require('express');
const puppeteer = require('puppeteer');
const debug = require('debug')('app:index');

const config = require('./config');

const PORT = config.get('port');
const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send(':)')
})
 
app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--headless',
      ],
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: './public/example.png' });
  
    await browser.close();
  })();
});


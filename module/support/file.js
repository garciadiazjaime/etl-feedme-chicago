const fs = require('fs');
const debug = require('debug')('app:log');

const config = require('../../config');

const publicPath = config.get('publicPath');

function saveFile(name, html) {
  fs.writeFileSync(name, html);
  debug(name);
}

async function saveHTML(name, html, page) {
  saveFile(`${publicPath}/${name}.html`, html);

  const imagePath = `${publicPath}/${name}.png`;
  await page.screenshot({ path: imagePath });
  debug(imagePath);
}

function saveJSON(name, content) {
  saveFile(`${publicPath}/${name}.json`, JSON.stringify(content));
}

module.exports = {
  saveHTML,
  saveJSON,
};

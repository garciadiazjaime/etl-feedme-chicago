const fs = require('fs');
const debug = require('debug')('app:extract');

async function extract(page, url, publicPath) {
  await page.goto(url);
  await page.waitForTimeout(2000);

  const html = await page.content();

  if (!html) {
    return debug('NO_HTML');
  }

  fs.writeFileSync(`${publicPath}/posts-from-hashtag.html`, html);
  await page.screenshot({ path: `${publicPath}/posts-from-hashtag.png` });

  if (html.includes('Oops, an error occurred')) {
    return debug('ERROR');
  }

  if (html.includes('Login • Instagram')) {
    return debug('LOGIN_REQUIRED');
  }

  if (html.includes('Content Unavailable') || html.includes('Page Not Found • Instagram')) {
    return debug('CONTENT_ERROR');
  }

  return html;
}

module.exports = extract;

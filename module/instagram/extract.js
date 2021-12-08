const debug = require('debug')('app:extract');

const sendEmail = require('../support/send-email');
const { saveHTML } = require('../support/file');

async function extract(page, url, count) {
  debug(url);
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
  } catch (error) {
    await sendEmail(`extract:${url} failed`);
    return debug(error);
  }

  await page.waitForTimeout(3000);

  const html = await page.content();

  if (!html) {
    return debug('NO_HTML');
  }

  await saveHTML(`posts-from-hashtag-${count}`, html, page);

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

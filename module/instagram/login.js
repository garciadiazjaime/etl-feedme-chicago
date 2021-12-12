const fs = require('fs');
const debug = require('debug')('app:login');

const config = require('../../config');

const publicPath = config.get('publicPath');

async function login(page) {
  const cachedCookies = config.get('instagram.cookies');

  if (cachedCookies) {
    debug('cookies from environment');
    return JSON.parse(decodeURIComponent(cachedCookies));
  }

  const url = 'https://www.instagram.com/accounts/login/';
  debug(url);

  try {
    await page.goto(url);
  } catch (error) {
    await page.screenshot({ path: `${publicPath}/login-00.png` });
    return debug(error);
  }

  await page.waitForTimeout(1000);

  let html = await page.content();
  fs.writeFileSync(`${publicPath}/login-01.html`, html);
  await page.screenshot({ path: `${publicPath}/login-01.png` });

  if (html.includes('Page Not Found • Instagram')) {
    return debug('ERROR_NO_LOGIN');
  }

  await page.type('input[name="username"]', config.get('instagram.username'));
  await page.type('input[name="password"]', config.get('instagram.password'));

  await page.screenshot({ path: `${publicPath}/login-02.png` });

  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  await page.screenshot({ path: `${publicPath}/login-03.png` });

  html = await page.content();

  if (html.includes('Suspicious Login Attempt')) {
    return debug('SUSPICIOUS_ATTEMPT');
  }

  if (html.includes('Your Account Has Been Temporarily Locked')) {
    return debug('ACCOUNT_LOCKED');
  }

  const cookies = await page.cookies();
  debug(`cookies:${!!cookies}`);
  fs.writeFileSync('./data/cookies.json', JSON.stringify(cookies));

  return cookies;
}

module.exports = login;

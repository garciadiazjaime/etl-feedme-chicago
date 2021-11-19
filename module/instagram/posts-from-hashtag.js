const fs = require('fs');
const jsdom = require('jsdom');

const debug = require('debug')('app:posts-from-hashtag');

const { JSDOM } = jsdom;

function getImage(media) {
  if (media.image_versions2
      && Array.isArray(media.image_versions2.candidates)
      && media.image_versions2.candidates.length) {
    return media.image_versions2.candidates[0].url;
  }

  if (media.carousel_media
      && Array.isArray(media.carousel_media)
      && Array.isArray(media.carousel_media[0].image_versions2.candidates)) {
    return media.carousel_media[0].image_versions2.candidates[0].url;
  }

  return null;
}

function extractPosts({ recent }, hashtag) {
  if (!Array.isArray(recent.sections) || !recent.sections.length) {
    return null;
  }

  const items = recent.sections.reduce((accu, item) => {
    item.layout_content.medias.forEach(({ media }) => {
      accu.push({
        id: media.id,
        permalink: `https://www.instagram.com/p/${media.code}/`,
        caption: media.caption ? media.caption.text : '',
        mediaUrl: getImage(media),
        source: hashtag,
      });
    });

    return accu;
  }, []);

  return items;
}

async function postsFromHashtag(hashtag, page, publicPath) {
  await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`);
  await page.waitForTimeout(2000);

  const html = await page.content();

  if (!html) {
    return debug('NO_HTML');
  }

  fs.writeFileSync(`${publicPath}/posts-from-hashtag-01.html`, html);

  if (html.includes('Oops, an error occurred')) {
    return debug('ERROR');
  }

  if (html.includes('Login • Instagram')) {
    return debug('LOGIN_REQUIRED');
  }

  if (html.includes('Content Unavailable') || html.includes('Page Not Found • Instagram')) {
    return debug('CONTENT_ERROR');
  }

  return new Promise((resolve) => {
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    dom.window.onload = () => {
      const { data } = dom.window._sharedData.entry_data.TagPage[0]; // eslint-disable-line

      if (!data) {
        debug('NO_DATA');
        return resolve();
      }

      const posts = extractPosts(data, hashtag);
      debug(`hashtag:posts:${posts.length}`);
      return resolve(posts);
    };
  });
}

module.exports = postsFromHashtag;

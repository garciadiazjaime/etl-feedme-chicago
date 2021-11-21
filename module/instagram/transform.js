const fs = require('fs');
const debug = require('debug')('app:transform');
const jsdom = require('jsdom');

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

function getLocation(location) {
  if (!location) {
    return null;
  }

  const response = {
    id: location.facebook_places_id,
    address: location.address,
    name: location.name,
  };

  if (location.lat && location.lng) {
    response.gps = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };
  }

  return response;
}

function getUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.pk,
    username: user.username,
    fullName: user.full_name,
    profilePicture: user.profile_pic_url,
  };
}

function getLikers(likers) {
  if (!likers) {
    return null;
  }

  return likers.map(getUser);
}

function getPostsFromData({ recent }, hashtag) {
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
        location: getLocation(media.location),
        user: getUser(media.user),
        likers: getLikers(media.likers),
      });
    });

    return accu;
  }, []);

  return items;
}

function transform(html, hashtag, publicPath) {
  if (!html) {
    return debug('NO_HTML');
  }

  return new Promise((resolve) => {
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    dom.window.onload = () => {
      const { data } = dom.window._sharedData.entry_data.TagPage[0]; // eslint-disable-line
      fs.writeFileSync(`${publicPath}/transform-${hashtag}.json`, JSON.stringify(data));

      if (!data) {
        debug('NO_DATA');
        return resolve();
      }

      const posts = getPostsFromData(data, hashtag);
      debug(`hashtag:posts:${posts.length}`);
      return resolve(posts);
    };
  });
}

module.exports = transform;

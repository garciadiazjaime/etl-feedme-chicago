const debug = require('debug')('app:transform');

const { saveJSON } = require('../support/file');
const sendEmail = require('../support/send-email');

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
        likeCount: media.like_count,
        commentsCount: media.comment_count,
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

async function getData(page, count) {
  const sharedData = await page.evaluate(() => typeof _sharedData !== undefined ? _sharedData : null) // eslint-disable-line

  if (!sharedData) {
    const name = `posts-from-hashtag-${count}`;
    debug(`ERROR:${name}`);
    return sendEmail(`<div>
      ERROR:${name} <br />
      <a href="https://feedmechicago.herokuapp.com/${name}.png">Print-screen</a> <br />
      <a href="https://feedmechicago.herokuapp.com/${name}.html">HTML</a>
    </div>`);
  }

  return sharedData.entry_data.TagPage[0].data;
}

async function transform(html, hashtag, count, page) {
  if (!html) {
    return debug('NO_HTML');
  }

  const data = await getData(page, count);
  saveJSON(`transform-${hashtag}-${count}`, data);
  if (!data) {
    return debug('NO_DATA');
  }

  const posts = getPostsFromData(data, hashtag);
  return posts;
}

module.exports = transform;

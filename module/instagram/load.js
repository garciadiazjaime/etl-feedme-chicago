const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:load');

const { PostModel } = require('../post/model');
const { saveJSON } = require('../support/file');
const uploadImage = require('../image/upload-image');

async function load(posts, hashtag, count) {
  if (!Array.isArray(posts) || !posts.length) {
    return debug('NO_POSTS');
  }

  saveJSON(`load-${hashtag}-${count}`, posts);

  let newPostsCount = 0;

  await mapSeries(posts, async (post) => {
    const documents = await PostModel.countDocuments({ id: post.id });

    if (documents) {
      return null;
    }

    newPostsCount += 1;
    const imageResponse = await uploadImage(post.id, post.mediaUrl, newPostsCount);

    return PostModel.findOneAndUpdate({ id: post.id }, {
      ...post,
      classification: null,
      imageUrl: imageResponse && imageResponse.url ? imageResponse.url : '',
    }, {
      upsert: true,
    });
  });

  return debug(`new posts:${newPostsCount}`);
}

module.exports = load;

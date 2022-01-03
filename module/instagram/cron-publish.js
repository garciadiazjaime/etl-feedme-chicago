const fetch = require('node-fetch');
const debug = require('debug')('app:publish');

const { PublishModel } = require('../post/model');
const config = require('../../config');

function adjustProtocol(url) {
  return url.replace(/http:/, 'https:');
}

async function main() {
  const documents = await PublishModel.find({
    published: {
      $ne: true,
    },
  }).limit(1);

  if (!documents.length) {
    debug('NO_POST_TO_PUBLISH');
    return null;
  }

  const post = documents[0];

  const url = config.get('publishService');
  const response = await fetch(`${url}?imageURL=${adjustProtocol(post.imageURL)}&caption=${post.caption}`);
  const data = await response.json();

  if (!data.published) {
    return debug('ERROR_PUBLISHING');
  }

  post.published = true;
  await post.save();

  return debug(`published:${post.id}`);
}

module.exports = main;

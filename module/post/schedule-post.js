const { PublishModel } = require('./model');

function schedulePost(id, username, imageURL, caption) {
  if (!id || !username || !imageURL || !caption) {
    return null;
  }

  return new PublishModel({
    id, username, imageURL, caption,
  }).save();
}

module.exports = schedulePost;

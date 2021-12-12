const { PostModel } = require('./model');

async function getPostsForImageClassification() {
  const posts = await PostModel
    .find({ classification: null })
    .sort({ createdAt: -1 })
    .limit(100);

  return posts;
}

module.exports = getPostsForImageClassification;

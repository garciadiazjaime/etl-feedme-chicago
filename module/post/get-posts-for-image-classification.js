const { PostModel } = require('./model');

async function getPostsForImageClassification() {
  const posts = await PostModel
    .find({ classification: { $exists: false } })
    .sort({ createdAt: -1 })
    .limit(100);

  return posts;
}

module.exports = getPostsForImageClassification;

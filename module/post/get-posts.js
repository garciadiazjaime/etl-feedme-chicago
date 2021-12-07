const { PostModel } = require('./model');

function getPosts(lastDays = 1, limit = 100) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  return PostModel.find({
    createdAt: {
      $gte: startDate,
    },
    classification: {
      $exists: true,
    },
  }).sort({ createdAt: -1 }).limit(limit);
}

module.exports = getPosts;

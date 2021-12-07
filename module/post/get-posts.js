const { PostModel } = require('./model');

function getPosts(lastDays = 1, limit = 100) {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - lastDays);

  return PostModel.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ createdAt: -1 }).limit(limit);
}

module.exports = getPosts;

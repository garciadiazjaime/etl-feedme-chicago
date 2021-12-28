const { PostModel } = require('./model');

async function getPostTopics(lastDays = 30, limit = 10000) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  const posts = await PostModel.find({
    createdAt: {
      $gte: startDate,
    },
    topics: {
      $ne: [],
    },
  }, {
    _id: false,
    topics: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  const topics = posts.reduce((accu, post) => {
    post.topics.forEach((item) => {
      if (!accu[item.className]) {
        accu[item.className] = 0; //eslint-disable-line
      }

      accu[item.className] += 1; //eslint-disable-line
    });

    return accu;
  }, {});

  const sorted = Object.keys(topics)
    .map((className) => ({
      className,
      total: topics[className],
    }))
    .sort((a, b) => b.total - a.total);

  const threshold = Math.round(sorted[0].total * 0.05);

  return sorted.filter((item) => item.total > threshold);
}

module.exports = getPostTopics;

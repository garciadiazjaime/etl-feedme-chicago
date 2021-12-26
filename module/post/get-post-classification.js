const { PostModel } = require('./model');

async function getPostClassification(lastDays = 30, limit = 10000) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  const posts = await PostModel.find({
    createdAt: {
      $gte: startDate,
    },
    $and: [
      {
        classification: {
          $ne: null,
        },
      },
      {
        classification: {
          $ne: [],
        },
      },
    ]
    ,
  }, {
    _id: false,
    classification: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  const classification = posts.reduce((accu, post) => {
    post.classification.forEach((item) => {
      if (!accu[item.className]) {
        accu[item.className] = 0; //eslint-disable-line
      }

      accu[item.className] += 1; //eslint-disable-line
    });

    return accu;
  }, {});

  const sorted = Object.keys(classification)
    .map((className) => ({
      className,
      total: classification[className],
    }))
    .sort((a, b) => b.total - a.total);

  const threshold = Math.round(sorted[0].total * 0.01);

  return sorted.filter((item) => item.total > threshold);
}

module.exports = getPostClassification;

const { PostModel } = require('./model');

async function getUsersLikes(lastDays = 30, limit = 100) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  const posts = await PostModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
        },
      },
    }, {
      $group: {
        _id: '$user.id',
        username: {
          $first: '$user.username',
        },
        total: {
          $sum: '$likeCount',
        },
      },
    }, {
      $sort: {
        total: -1,
      },
    }, {
      $limit: limit,
    },
  ]);

  return posts;
}

module.exports = getUsersLikes;

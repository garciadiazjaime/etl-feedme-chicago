const { PostModel } = require('./model');

function getPostsSummary(lastDays = 30) {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - lastDays);

  const query = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    }, {
      $addFields: {
        hasLocation: {
          $or: [
            {
              $objectToArray: '$location',
            },
          ],
        },
      },
    }, {
      $addFields: {
        locationCount: {
          $cond: {
            if: {
              $eq: [
                '$hasLocation', true,
              ],
            },
            then: 1,
            else: 0,
          },
        },
      },
    }, {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        count: {
          $sum: 1,
        },
        likes: {
          $sum: '$likeCount',
        },
        comments: {
          $sum: '$commentsCount',
        },
        locations: {
          $sum: '$locationCount',
        },
      },
    }, {
      $sort: {
        _id: 1,
      },
    },
  ];

  return PostModel.aggregate(query);
}

module.exports = getPostsSummary;

const getUsersLikes = require('./get-users-likes');
const { PostModel, PublishModel } = require('./model');

const blockUsers = [
  'ceedays',
  'jeffmauro',
  '_weloveusa',
  'md.food.blog',
  'estephymusic',
  'andreanmakeup',
  'eatsbyarchita',
  'bears_alliance',
  'chef.joe.sasto',
  'chicago.explore',
  'jana_berlin.food',
  'bloomtime.coffee',
  'jana_berlin_food',
  'wilmasfoodandnature',
  'overheard_in_chicago',
  'the_chicago_conservative',
];

async function getUserUnpublished(users, index, startDate) {
  if (!Array.isArray(users) || !users.length) {
    return null;
  }

  if (index >= users.length) {
    return null;
  }

  const { username } = users[index];

  const documents = await PublishModel.count({
    username,
    createdAt: {
      $gte: startDate,
    },
  });

  if (documents) {
    return getUserUnpublished(users, index + 1, startDate);
  }

  return users[index];
}

async function getPostPreview(lastDays = 30) {
  const userLikes = await getUsersLikes();
  const users = userLikes.filter((item) => !blockUsers.includes(item.username));

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  const user = await getUserUnpublished(users, 0, startDate);

  const posts = await PostModel.find({
    'user.username': user.username,
    imageUrl: {
      $exists: true,
    },
    createdAt: {
      $gte: startDate,
    },
  })
    .sort({ likeCount: -1, createdAt: -1 })
    .limit(7);

  const preview = {
    user,
    posts,
  };

  return preview;
}

module.exports = getPostPreview;

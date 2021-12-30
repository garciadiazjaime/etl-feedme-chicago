const NodeCache = require('node-cache');

const getUsersLikes = require('./get-users-likes');
const { PostModel, PublishModel } = require('./model');

const myCache = new NodeCache();

const blockUsers = [
  'jana_berlin.food',
];

async function getUserUnpublished(users, index, startDate) {
  if (!Array.isArray(users) || !users.length) {
    return null;
  }

  if (index >= users.length) {
    return null;
  }

  const { username } = users[index];

  const publish = await PublishModel.find({
    username,
    createdAt: {
      $gte: startDate,
    },
  });

  if (publish.length) {
    return getUserUnpublished(users, index + 1);
  }

  return users[index];
}

async function getPostPreview(lastDays = 30) {
  const cacheKey = 'getPostPreview';
  const response = myCache.get(cacheKey);
  if (response) {
    return response;
  }

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
    .limit(3);

  const preview = {
    user,
    posts,
  };

  const cacheExpiresDay = 1 * 60 * 60 * 24;
  myCache.set(cacheKey, JSON.stringify(preview), cacheExpiresDay);

  return preview;
}

module.exports = getPostPreview;

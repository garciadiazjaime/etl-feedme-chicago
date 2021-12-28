const { PostModel } = require('./model');

async function getPostsUsers(lastDays = 30, limit = 10000) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  const posts = await PostModel.find({
    createdAt: {
      $gte: startDate,
    },
  }, {
    _id: false,
    'user.username': true,
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  const postsByUser = posts.reduce((accu, post) => {
    const { username } = post.user;
    if (!accu[username]) {
        accu[username] = 0; //eslint-disable-line
    }

      accu[username] += 1; //eslint-disable-line

    return accu;
  }, {});

  const sorted = Object.keys(postsByUser)
    .map((username) => ({
      username,
      total: postsByUser[username],
    }))
    .sort((a, b) => b.total - a.total);

  const threshold = Math.round(sorted[0].total * 0.05);

  return sorted.filter((item) => item.total > threshold);
}

module.exports = getPostsUsers;

const mapSeries = require('async/mapSeries');

const { PostModel } = require('./model');

async function getPostsFromDay(startDate, endDate) {
  const posts = await PostModel.find({
    user: { $exists: 1 },
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const postByUser = {};

  posts.reduce((accu, post) => {
    const {
      user: {
        username,
      },
      commentsCount = 0,
      likeCount = 0,
    } = post;

    if (!postByUser[username]) {
      postByUser[username] = {
        postsCount: 0,
        commentsCount: 0,
        likeCount: 0,
        total: 0,
      };
    }

    postByUser[username].postsCount += 1;
    postByUser[username].commentsCount += commentsCount;
    postByUser[username].likeCount += likeCount;
    postByUser[username].total = postByUser[username].postsCount
      + postByUser[username].commentsCount
      + postByUser[username].likeCount;

    return accu;
  }, postByUser);

  return postByUser;
}

function getTopPosts(posts, limit = 10) {
  return Object.entries(posts).sort((a, b) => b[1].total - a[1].total).slice(0, limit);
}

function getPostsByDay(lastDays = 30) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const times = Array.apply(null, Array(lastDays)).map((x, i) => i); // eslint-disable-line

  return mapSeries(times, async () => {
    const posts = await getPostsFromDay(startDate, endDate);
    const day = new Date(startDate);

    startDate.setDate(startDate.getDate() - 1);
    endDate.setDate(endDate.getDate() - 1);

    return {
      date: day,
      posts: getTopPosts(posts),
    };
  });
}

module.exports = getPostsByDay;

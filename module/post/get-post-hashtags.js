const { PostModel } = require('./model');

async function getPostHashtags(lastDays = 30, limit = 10000) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - lastDays);

  const posts = await PostModel.find(
    {
      createdAt: {
        $gte: startDate,
      },
    },
    {
      _id: false,
      caption: true,
    },
  )
    .sort({ createdAt: -1 })
    .limit(limit);

  const hashtagsMap = posts.reduce((accu, post) => {
    const hashtags = post.caption.match(/#\w+/g);
    if (!Array.isArray(hashtags) || !hashtags.length) {
      return accu;
    }

    post.caption.match(/#\w+/g).forEach((hashtag) => {
      if (!accu[hashtag]) {
        accu[hashtag] = 0; //eslint-disable-line
      }

      accu[hashtag] += 1; //eslint-disable-line
    });

    return accu;
  }, {});

  const sorted = Object.keys(hashtagsMap)
    .map((hashtag) => ({
      hashtag,
      total: hashtagsMap[hashtag],
    }))
    .sort((a, b) => b.total - a.total);

  const threshold = Math.round(sorted[0].total * 0.05);

  return sorted.filter((item) => item.total > threshold);
}

module.exports = getPostHashtags;

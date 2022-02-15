const mapSeries = require('async/mapSeries');

const { PostModel } = require('./model');

async function getPostByCategory(category, source, limit = 50) {
  if (category) {
    return PostModel.find({
      $text: {
        $search: category,
      },
      source,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  const categories = ['cafe', 'restaurant', 'bar'];

  const response = [];

  await mapSeries(categories, async (cat) => {
    const posts = await PostModel.find({
      $text: {
        $search: cat,
      },
      source,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    response.push({
      name: cat,
      places: posts,
    });
  });

  return response;
}

module.exports = getPostByCategory;

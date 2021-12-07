const { PostModel } = require('./model');

async function savePostClassification(id, classification) {
  await PostModel.findOneAndUpdate({ id }, {
    classification,
  }, {
    upsert: true,
  });
}

module.exports = savePostClassification;

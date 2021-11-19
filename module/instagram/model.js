const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  caption: String,
  id: String,
  mediaUrl: String,
  permalink: String,
  source: String,
}, {
  timestamps: true,
});

const PostModel = mongoose.model('postRaw', PostSchema);

module.exports = {
  PostModel,
};

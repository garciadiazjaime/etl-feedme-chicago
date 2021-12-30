const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuoteSchema = new Schema({
  text: String,
  author: String,
  query: String,
}, {
  timestamps: true,
});

const QuoteModel = mongoose.model('quote', QuoteSchema);

module.exports = {
  QuoteModel,
};

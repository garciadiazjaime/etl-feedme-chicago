const mongoose = require('mongoose');

const config = require('../../config');

function openDB() {
  return mongoose.connect(config.get('db.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  openDB,
};

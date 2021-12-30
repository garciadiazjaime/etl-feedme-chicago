require('newrelic');
const express = require('express');
const debug = require('debug')('app:index');
const morgan = require('morgan');

const { setupCron } = require('./module/support/cron');
const { openDB } = require('./module/support/database');
const postRoutes = require('./module/post/routes');
const quoteRoutes = require('./module/quote/routes');
const { resetFolder } = require('./module/support/folder');
const config = require('./config');

const PORT = config.get('port');
const app = express();
app.use(morgan('combined'));

const publicPath = config.get('publicPath');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.send(':)');
});

app.use('', postRoutes);
app.use('', quoteRoutes);

app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  await openDB();
  resetFolder(publicPath);
  await setupCron();

  return null;
});

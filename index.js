require('newrelic');
const express = require('express');
const debug = require('debug')('app:index');
const morgan = require('morgan');

const login = require('./module/instagram/login');
const { checkFolder } = require('./module/support/folder');
const { getPage } = require('./module/support/page');
const { setupCron } = require('./module/support/cron');
const { openDB } = require('./module/support/database');
const postRoutes = require('./module/post/routes');
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

app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  checkFolder(publicPath);
  checkFolder('./data');

  await openDB();

  const page = await getPage();

  const cookies = await login(page, publicPath);

  await setupCron(cookies, page, publicPath);

  return null;
});

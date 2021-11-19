const express = require('express');
const debug = require('debug')('app:index');

const login = require('./module/instagram/login')
const {checkPublicFolder} = require('./module/support/folder')
const { getPage } = require('./module/support/page')
const { setupCron } = require('./module/support/cron')
const config = require('./config');

const PORT = config.get('port');
const app = express()
const publicPath = './public'

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.send(':)')
})
 
app.listen(PORT, async () => {
  debug(`Listening on ${PORT}`);

  checkPublicFolder(publicPath)

  const page = await getPage()
    
  await login(page, publicPath)

  setupCron(page, publicPath)
});


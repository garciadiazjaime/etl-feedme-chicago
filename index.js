const express = require('express');
const debug = require('debug')('app:index');

const login = require('./module/instagram/login')
const { resetFolder, checkFolder } = require('./module/support/folder')
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

  resetFolder(publicPath)
  checkFolder('./data')

  const page = await getPage()
    
  const cookies = await login(page, publicPath)

  await setupCron(cookies, page, publicPath)
});


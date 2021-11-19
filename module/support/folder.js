const fs = require('fs');
const debug = require('debug')('app:folder');

function resetFolder(folder) {
  if (fs.existsSync(folder)){
    debug(`removing ${folder}...`)
    fs.rmdirSync(folder, { recursive: true });
  }

  debug(`${folder} created`)
  fs.mkdirSync(folder);
}

function checkFolder(folder) {
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  } else {
    debug(`${folder} exists`)
  }
}

module.exports = {
  resetFolder,
  checkFolder,
}

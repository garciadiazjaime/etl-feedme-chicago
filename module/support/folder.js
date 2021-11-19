const fs = require('fs');

function checkPublicFolder(publicPath) {
  if (fs.existsSync(publicPath)){
    fs.rmdirSync(publicPath, { recursive: true });
  }

  fs.mkdirSync(publicPath);
}

module.exports = {
  checkPublicFolder
}

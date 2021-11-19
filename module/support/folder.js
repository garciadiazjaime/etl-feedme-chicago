const fs = require('fs');

function resetFolder(folder) {
  if (fs.existsSync(folder)){
    fs.rmdirSync(folder, { recursive: true });
  }

  fs.mkdirSync(folder);
}

function checkFolder(folder) {
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
}

module.exports = {
  resetFolder,
  checkFolder,
}

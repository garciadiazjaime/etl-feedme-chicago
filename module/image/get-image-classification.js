const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');
const fs = require('fs');

const debug = require('debug')('app:classify-images');

function readImage(path) {
  const imageBuffer = fs.readFileSync(path);
  const tfimage = tfnode.node.decodeImage(imageBuffer);

  return tfimage;
}

async function imageClassification(path) {
  const image = readImage(path);

  const mobilenetModel = await mobilenet.load();
  const predictions = await mobilenetModel.classify(image);

  return predictions;
}

async function getImageClassification(path) {
  debug(`classifying:${path}`);

  if (!path || !fs.existsSync(path)) {
    return [];
  }

  const classification = await imageClassification(path);
  return classification;
}

module.exports = getImageClassification;

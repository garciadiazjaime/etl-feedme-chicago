const mapSeries = require('async/mapSeries');
const debug = require('debug')('app:get-topics');

const { openDB } = require('../support/database');
const LDA = require('../lda');
const { PostModel } = require('./model');

function getTopics(post) {
  const terms = 3;
  const {
    caption,
    id,
  } = post;

  if (!caption || !caption.length) {
    debug(`NO_CAPTION:${id}`);
    return [];
  }

  let documents = `${caption.replace(/\n/g, '.')}.`.match(/[^.!?]+[.!?]+/g);
  let [topics] = LDA(documents, 1, terms);

  if (!topics || !topics.length) {
    // excluding hashtags usually at the end
    documents = `${caption.replace(/\n/g, '.')}`.match(/[^.!?]+[.!?]+/g);
    [topics] = LDA(documents, 1, terms);
  }

  if (!topics || !topics.length) {
    debug(`NO_TOPICS:${id}`);
    return [];
  }

  return topics.reduce((accu, {
    term,
    probability,
  }) => {
    accu.push({
      probability: probability * 100,
      className: term,
    });

    return accu;
  }, []);
}

async function main() {
  await openDB();

  const posts = await PostModel.find({ topics: { $exists: false } })
    .sort({ createdAt: -1 });

  debug(`posts:${posts.length}`);
  let cont = 1;

  await mapSeries(posts, async (post) => {
    const topics = getTopics(post);
    post.topics = topics; //eslint-disable-line
    await post.save();

    debug(`updated:${cont}:${post.id}`);
    cont += 1;
  });
}

if (require.main === module) {
  main().then(() => {
    debug('done');
  });
}

module.exports = getTopics;

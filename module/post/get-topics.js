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

  const content = [`${caption}.` || ''];

  const documents = content.join('.').match(/[^\.!\?]+[\.!\?]+/g); //eslint-disable-line
  const [topics] = LDA(documents, 1, terms);

  if (!topics) {
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

async function main(limit = 10000) {
  await openDB();

  const posts = await PostModel.find({ topics: { $exists: false } })
    .sort({ createdAt: -1 });

  debug(`posts:${posts.length}:${limit}`);
  let cont = 1;

  await mapSeries(posts.slice(0, limit), async (post) => {
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

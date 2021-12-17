const express = require('express');
const cors = require('cors');

const getPostsByDay = require('./get-posts-by-day');
const getPostsSummary = require('./get-posts-summary');
const getPost = require('./get-posts');
const getPostClassification = require('./get-post-classification');

const router = express.Router();

router.get('/posts/by-day', cors(), async (req, res) => {
  const posts = await getPostsByDay();

  res.send(posts);
});

router.get('/posts/summary', cors(), async (req, res) => {
  const summary = await getPostsSummary();

  res.send(summary);
});

router.get('/posts', cors(), async (req, res) => {
  const posts = await getPost();

  res.send(posts);
});

router.get('/posts/classification', cors(), async (req, res) => {
  const classifications = await getPostClassification();

  res.send(classifications);
});

module.exports = router;

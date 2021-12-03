const express = require('express');
const cors = require('cors');

const getPostsByDay = require('./get-posts-by-day');
const getPostsSummary = require('./get-posts-summary');

const router = express.Router();

router.get('/posts/by-day', cors(), async (req, res) => {
  const posts = await getPostsByDay();

  res.send(posts);
});

router.get('/posts/summary', cors(), async (req, res) => {
  const summary = await getPostsSummary();

  res.send(summary);
});

module.exports = router;

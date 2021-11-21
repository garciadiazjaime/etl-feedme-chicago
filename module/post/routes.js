const express = require('express');
const cors = require('cors');

const getPostsByDay = require('./get-posts-by-day');

const router = express.Router();

router.get('/posts/by-day', cors(), async (req, res) => {
  const posts = await getPostsByDay();

  res.send(posts);
});

module.exports = router;

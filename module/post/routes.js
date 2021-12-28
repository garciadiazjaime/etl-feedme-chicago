const express = require('express');
const cors = require('cors');

const getPostsByDay = require('./get-posts-by-day');
const getPostsSummary = require('./get-posts-summary');
const getPost = require('./get-posts');
const getPostClassification = require('./get-post-classification');
const getPostTopics = require('./get-post-topics');
const getPostHashtags = require('./get-post-hashtags');
const getPostsUsers = require('./get-posts-users');
const getUsersLikes = require('./get-users-likes');

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

router.get('/posts/topics', cors(), async (req, res) => {
  const topics = await getPostTopics();

  res.send(topics);
});

router.get('/posts/hashtags', cors(), async (req, res) => {
  const hashtags = await getPostHashtags();

  res.send(hashtags);
});

router.get('/posts/users', cors(), async (req, res) => {
  const postsbyUser = await getPostsUsers();

  res.send(postsbyUser);
});

router.get('/posts/likes', cors(), async (req, res) => {
  const usersLikes = await getUsersLikes();

  res.send(usersLikes);
});

module.exports = router;

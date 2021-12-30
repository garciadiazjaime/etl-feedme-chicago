const express = require('express');
const cors = require('cors');

const getQuote = require('./get-quote');

const router = express.Router();

router.get('/quote', cors(), async (req, res) => {
  const { query } = req.query;

  const quote = await getQuote(query);

  res.send(quote || {});
});

module.exports = router;

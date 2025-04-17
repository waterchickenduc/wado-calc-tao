const express = require('express');
const router = express.Router();
const { searchRunes } = require('../models/runes');

router.get('/search', (req, res) => {
  const results = searchRunes(req.query);
  res.json(results);
});

module.exports = router;

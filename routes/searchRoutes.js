const express = require('express');
const router  = express.Router();
const search = require('../db/queries/searches');
const post = require('../db/queries/post');

router.get("/results", (req, res) => {
  const templateVars = {
    search: search.regSearch(req.query.search)
  };
  res.render("results", templateVars);
});

exports.router = router;

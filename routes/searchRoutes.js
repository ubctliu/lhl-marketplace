const express = require('express');
const router  = express.Router();
const search = require('../db/queries/searches');
const post = require('../db/queries/post');

router.get("/results/:query", (req, res) => {
  const templateVars = {
    userId: req.session.userId,
    firstName: req.session.firstName,
    lastName: req.session.lastName,
    queryTerm: req.params.query,
    user_type: req.session.userType
  };
  res.render('results', templateVars);
});

router.get("/api/results/:query", (req, res) => {
  if (req.params.query === "undefined") {
    return res.status(400).send("Invalid search query");
  }
  search.regSearch(req.params.query)
    .then((data) => {
      if (data && data.length > 0) {
        res.json(data);
      } else {
        res.send('No results found for your query');
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/search", (req, res) => {
  if (req.body.searchTerm !== '') {
    res.redirect(`results/${req.body.searchTerm}`);
  }
});


router.get("/advsearch", (req, res) => {
  const templateVars = {
    userId: req.session.userId,
    firstName: req.session.firstName,
    lastName: req.session.lastName,
    user_type: req.session.userType
  };
  res.render('advSearch', templateVars);
});

router.post("/advsearch", (req, res) => {
  console.log("Searching for:", req.body); // Debug liner
  search.advSearch(req.body)
    .then(results => {
      console.log("Search results:", results); // Debug line
      res.redirect(`/listings/${results[0].id}`);
    });
});

module.exports = router;

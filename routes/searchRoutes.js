const express = require('express');
const router  = express.Router();
const search = require('../db/queries/searches');
const post = require('../db/queries/post');

router.get("/results/:query", async (req, res) => {
  if (req.params.query === "undefined") {
    return res.status(400).send("Invalid search query");
  }
  try {
    console.log("Fetching results for:", req.params.query); // Debug line
    let searchResults = await search.regSearch(req.params.query);
    console.log("Search results:", searchResults); // Debug line
    if (searchResults && searchResults.length > 0) {
      res.redirect(`/listings/${searchResults[0].id}`);
    } else {
      res.send('No results found for your query');
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
});




router.post("/search", (req, res) => {
  try {
    console.log("Searching for:", req.body); // Debug liner
    res.redirect(`results/${req.body.searchTerm}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.get("/advsearch", (req, res) => {
  res.render('advSearch');
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

const express = require('express');
const router  = express.Router();
const search = require('../db/queries/searches');
const post = require('../db/queries/post');
const searchInput = require('../public/scripts/search');


router.get("/results", (req, res) => {
  console.log(req.query.search);
  const templateVars = {
    search: search.regSearch(req.query.search)
  };
  res.render("results", templateVars);
});


router.post("/search", async (req, res) => {
 try {
  const searchResult = await search.regSearch(req.body.searchTerm);
  const templateVars = {
    search: searchResult[0]
   };
  console.log(templateVars.search, "templateVars.search");
  res.render("results", templateVars);
} catch (err) {
  // handle error
  res.status(500).send('Server Error');
}

});


module.exports = router;

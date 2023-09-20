const express = require('express');
const router  = express.Router();
const listingsQueries = require('../db/queries/listings-queries')


router.get('/', (req, res) => {
  res.render('listing-details');
});

// show a specific item
router.get("/:id", (req, res) => {
  listingsQueries.getListingById(id)
    .then(data => {
      const item = data.rows[0];
      res.render("listing-detail");
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
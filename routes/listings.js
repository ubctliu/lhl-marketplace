const express = require('express');
const router  = express.Router();
const listingsQueries = require('../db/queries/listings-queries')


// show a specific item
router.get("/listings/:id", (req, res) => {
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
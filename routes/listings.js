/*
 * All routes for Listings are defined here
 * Since this file is loaded in server.js into /listings,
 *   these routes are mounted onto /listings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getAllListings, getAllFeatured, regenerateFeaturedListings } = require('../db/queries/listings');
const listingsQueries = require('../db/queries/listings-queries');

const MAX_FEATURED_LISTINGS = 5;
const MAX_NUMBER_OF_LISTINGS_ON_PAGE = 20;

router.get('/', (req, res) => {
  getAllListings({}, MAX_NUMBER_OF_LISTINGS_ON_PAGE)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get('/featured', (req, res) => {
  getAllFeatured(MAX_FEATURED_LISTINGS)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get('/refeature', (req, res) => {
  regenerateFeaturedListings();
});




// show a specific item
router.get("/:id", (req, res) => {
  const id = req.params.id;

  listingsQueries.getListingById(id)
  .then(data => {
    console.log("Query Result:", data);
    if (!data) {
      res.status(404).json({ error: "Listing not found" });
    } else {
      const templateVars = {
        userId: req.session.userId,
        firstName: req.session.firstName,
        lastName: req.session.lastName,
        listing: data
      };
      console.log(templateVars);
      res.render("listing-details",  templateVars );
    }
  })
  .catch(err => {
    console.error("Query Error:", err);
    res.status(500).json({ error: err.message });
  });
});

module.exports = router;

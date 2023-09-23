/*
 * All routes for Listings are defined here
 * Since this file is loaded in server.js into /listings,
 *   these routes are mounted onto /listings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/connection');
const { getAllListings, getAllFeatured, regenerateFeaturedListings } = require('../db/queries/listings');
const listingsQueries = require('../db/queries/listings-queries');

const MAX_FEATURED_LISTINGS = 5;
const MAX_NUMBER_OF_LISTINGS_ON_PAGE = 18;

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

router.get("/edit/:id", (req, res) => {
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
          listing: data,
          user_type: req.session.userType
        };
        console.log(templateVars);
        res.render("edit-listing", templateVars);
      }
    });
});

router.post('/delete/:id', (req, res) => {
  const id = req.params.id;

  const queryString = 'UPDATE listings SET is_deleted = true WHERE id = $1';
  const queryParams = [id];

  db.query(queryString, queryParams)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Mark a listing as sold (decrease stock by one)
router.post('/mark-as-sold/:id', (req, res) => {
  const id = req.params.id;

  const queryString = 'UPDATE listings SET stock = stock - 1 WHERE id = $1';
  const queryParams = [id];

  db.query(queryString, queryParams)
    .then(() => {
      // Redirect back to the same page with updated data
      res.redirect(`/listings/${id}`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
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
          listing: data,
          user_type: req.session.userType
        };
        console.log(templateVars);
        res.render("listing-details",  templateVars);
      }
    })
    .catch(err => {
      console.error("Query Error:", err);
      res.status(500).json({ error: err.message });
    });
});


router.post('/:id', (req, res) => {
  let queryString = `UPDATE listings SET `;
  let queryParams = [];

  if (req.body.title) {
    queryParams.push(req.body.title);
    queryString += `title = $${queryParams.length}, `;
  }

  if (req.body.description) {
    queryParams.push(req.body.description);
    queryString += `description = $${queryParams.length}, `;
  }

  if (req.body.price) {
    queryParams.push(req.body.price);
    queryString += `price = $${queryParams.length}, `;
  }

  if (req.body.category) {
    queryParams.push(req.body.category);
    queryString += `category = $${queryParams.length}, `;
  }

  if (req.body.stock) {
    queryParams.push(req.body.stock);
    queryString += `stock = $${queryParams.length}, `;
  }

  if (req.body.image_url) {
    queryParams.push(req.body.image_url);
    queryString += `image_url = $${queryParams.length}, `;
  }

  if (req.body.is_featured) {
    queryParams.push(req.body.is_featured);
    queryString += `is_featured = $${queryParams.length}, `;
  }

  queryString = queryString.slice(0, -2); // Remove the trailing comma and space

  queryParams.push(req.params.id);
  queryString += ` WHERE id = $${queryParams.length};`;

  db.query(queryString, queryParams)
    .then(() => {
      // Redirect to the specific listing using the listing ID
      res.redirect(`/listings/${req.params.id}`);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;

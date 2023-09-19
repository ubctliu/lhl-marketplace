/*
 * All routes for Listings are defined here
 * Since this file is loaded in server.js into /listings,
 *   these routes are mounted onto /listings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const db = require('../db/connection');
const router  = express.Router();

router.get('/', (req, res) => {
  db.query(`
  SELECT listings.*, users.* 
  FROM listings 
  JOIN users ON listings.user_id = users.id 
  LIMIT 8;`)
    .then((data) => {
      res.json(data.rows);
    });
});

router.get('/featured', (req, res) => {
  db.query(`
  SELECT listings.*, users.* 
  FROM listings 
  JOIN users ON listings.user_id = users.id 
  WHERE listings.is_featured = true
  LIMIT 3;`)
    .then((data) => {
      res.json(data.rows);
    });
});

module.exports = router;

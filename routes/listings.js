/*
 * All routes for Listings are defined here
 * Since this file is loaded in server.js into /listings,
 *   these routes are mounted onto /listings
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const db = require('../db/connection');
const router  = express.Router();

const MAX_FEATURED_LISTINGS = 5;
const AMOUNT_OF_NEW_FEATURED_LISTINGS = 5;
const MIN_LISTING_ID_NUMBER = 2;
const MAX_LISTING_ID_NUMBER = 32;
const MAX_NUMBER_OF_LISTINGS_ON_PAGE = 20;

router.get('/', (req, res) => {
  db.query(`
  SELECT listings.*, users.* 
  FROM listings 
  JOIN users ON listings.user_id = users.id 
  LIMIT ${MAX_NUMBER_OF_LISTINGS_ON_PAGE};`)
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
  LIMIT ${MAX_FEATURED_LISTINGS};`)
    .then((data) => {
      res.json(data.rows);
    });
});

router.get('/refeature', (req, res) => {

  const generateRandomInts = (length, min, max) => {
    const randomInts = [];
    for (let i = 0; i < length; i++) {
      const randomInt = Math.floor(Math.random() * (max - min + 1) + min);
      randomInts.push(randomInt);
    }
    return randomInts;
  };

  let newListingIds = generateRandomInts(AMOUNT_OF_NEW_FEATURED_LISTINGS, MIN_LISTING_ID_NUMBER, MAX_LISTING_ID_NUMBER);
  let listingIds = [Array.from({length: MAX_LISTING_ID_NUMBER}, (_, i) => i + 2)];
  
  db.query(`
  UPDATE listings
  SET is_featured = false
  WHERE listings.id = ANY($1)
  AND is_featured = true;
  `, [listingIds])
    .then(() => {
      db.query(`
  UPDATE listings
  SET is_featured = true
  WHERE listings.id = ANY($1)
  AND is_featured = false;
  `, [newListingIds])
        .then(() => {
          console.log("Added new featured items successfully.");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

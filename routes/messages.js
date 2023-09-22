/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /messages,
 *   these routes are mounted onto /messages
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { addMessageToDatabase } = require('../db/queries/messages');

router.post('/sendmessage', (req, res) => {
  const userId = req.body.userId;
  const sellerId = req.body.sellerId;
  const listingId = req.body.listingId;
  const message = req.body.message;
  const currentPrice = req.body.price;
  addMessageToDatabase(userId, sellerId, listingId, message, currentPrice)
    .then((data) => {
      res.status(200).send("Successfully added message to the database.");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /messages,
 *   these routes are mounted onto /messages
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { addMessageToDatabase, getMessageHistoryByAllIds } = require('../db/queries/messages');
const { getListingById } = require('../db/queries/listings-queries');

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

// express route to handle redirection from listing's page to messages page
router.get('/send/:sellerId/:listingId', (req, res) => {
  const userId = req.session.userId;
  const sellerId = Number(req.params.sellerId);
  const listingId = Number(req.params.listingId);
  getMessageHistoryByAllIds(userId, sellerId, listingId)
    .then((data) => {
      let chatHistoryExists = null;
      if (data.length === 0) {
        chatHistoryExists = false;
      } else {
        chatHistoryExists = true;
      }
      let listing = {};
      getListingById(listingId)
        .then((data) => {
          listing = data;

          const templateVars = {
            userId,
            firstName: req.session.firstName,
            lastName: req.session.lastName,
            sellerId: sellerId,
            listingId: listingId,
            chatHistoryExists: chatHistoryExists,
            listing
          };
          console.log(templateVars);
          res.render('messages', templateVars);
        });
    });
});


module.exports = router;
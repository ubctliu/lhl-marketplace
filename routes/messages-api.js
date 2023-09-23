/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto api/messages
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getMessageHistoryByUserId, getMessageHistoryByBothUserIds, getMessageHistoryByAllIds } = require('../db/queries/messages');
const { getListingById } = require('../db/queries/listings-queries');


router.get('/chat-history/:userId/:sellerId/:listingId', (req, res) => {
  const userId = Number(req.params.userId);
  const sellerId = Number(req.params.sellerId);
  const listingId = Number(req.params.listingId);
  getMessageHistoryByAllIds(userId, sellerId, listingId)
    .then((data) => {
      if (data.length === 0) {
        getListingById(Number(listingId)).then((done) => {
          res.json(done);
        });
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get('/chat-history/:userId/:sellerId', (req, res) => {
  const userId = req.params.userId;
  const sellerId = req.params.sellerId;
  getMessageHistoryByBothUserIds(userId, sellerId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

// api path for chat-history for specific user id
router.get('/chat-history/:userId', (req, res) => {
  const userId = req.params.userId;
  getMessageHistoryByUserId(userId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

// generic chat-history based on logged-in user
router.get('/chat-history', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).send("You need to be logged in to view your chat history!");
    return;
  }
  getMessageHistoryByUserId(userId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});


module.exports = router;
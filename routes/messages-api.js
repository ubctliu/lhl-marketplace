/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/messages,
 *   these routes are mounted onto api/messages
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getMessageHistoryByUserId, getMessageHistoryByBothUserIds } = require('../db/queries/messages');


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

module.exports = router;
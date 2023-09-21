/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getUserDetailsWithListingsById } = require('../db/queries/users');
const { getAllFavoritesByUser } = require('../db/queries/favorites');

router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/favorites', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).send("Error occurred. Must be logged in to have favorites!");
    return;
  }
  getAllFavoritesByUser(userId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/userlistings', (req, res) => {
  const userId = req.session.userId;
  console.log('this id comes from session.cookie: ',userId)
   if (!userId) {
     res.status(401).send("Error occurred. Must be logged in to have listings!");
     return;
   }

  getUserDetailsWithListingsById(userId)
    .then((listings) => {
      console.log(`query data: ${listings}`);
      res.json(listings);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


module.exports = router;

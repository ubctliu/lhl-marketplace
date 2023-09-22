/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/connection');
const { getUserDetailsWithListingsById, getUsers } = require('../db/queries/users');
const { getAllFavoritesByUser } = require('../db/queries/favorites');

router.get('/', (req, res) => {
  getUsers()
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

router.get('/getuserid', (req, res) => {
  const userId = req.session.userId;
  res.json({ userId });
});

router.get('/getusername', (req, res) => {
  const userId = req.session.userId;
  const firstName = req.session.firstName;
  const lastName = req.session.lastName;
  res.json({ userId, firstName, lastName });
});


router.get('/userlistings', (req, res) => {
  const userId = req.session.userId;
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


// go to add new listing page
router.get("/userlistings/new", (req, res) => {
  const templateVars = {
    userId: req.session.userId,
    firstName: req.session.firstName,
    lastName: req.session.lastName
  };
  res.render('post', templateVars);
});

// add new listing
router.post('/userlistings', async (req, res) => {
  try {
    const queryString = `
      INSERT INTO listings(user_id, title, description, price, category, stock, image_url, is_featured)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const queryParams = [
      req.session.userId,
      req.body.title,
      req.body.description,
      req.body.price,
      req.body.category,
      req.body.stock,
      req.body.image_url,
      req.body.is_featured
    ];

    await db.query(queryString, queryParams);

    res.redirect('/users/userlistings');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

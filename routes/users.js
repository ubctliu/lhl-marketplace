/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  res.render('users');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});


router.post('/signin', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "") {
    console.log("Username and/or Password Empty");
    res.status(400).send("Error 400: Username and/or Password Empty.");
    return;
  }

  // Use the checkUserByEmailAndPassword function to check if email and password match
  userQueries.checkUserByEmailAndPassword(email, password)
    .then(user => {
      if (user) {
        // Redirect the user to the home
        res.redirect('/');
      } else {
        console.log("Invalid Email or Password");
        res.status(401).send("Error 401: Invalid Email or Password.");
      }
    })
    .catch(err => {
      console.error("Error checking user:", err);
      res.status(500).send("Error 500: Internal Server Error.");
    });
});


router.get('/createaccount', (req, res) => {
  res.render('createaccount');
});

module.exports = router;

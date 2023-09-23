/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { createaccount, checkUserByEmailAndPassword,getUserDetailsWithListingsById } = require('../db/queries/users');
const { addToFavorites, isListingFavorited, removeFromFavorites } = require('../db/queries/favorites');


router.get('/', (req, res) => {
  res.render('users');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/messages', (req, res) => {
  const templateVars = {
    userId: req.session.userId,
    firstName: req.session.firstName,
    lastName: req.session.lastName
  };
  res.render('messages', templateVars);
});

router.get('/favorites', (req, res) => {
  const templateVars = {
    userId: req.session.userId,
    firstName: req.session.firstName,
    lastName: req.session.lastName
  };
  res.render('favorites', templateVars);
});

router.post('/favorites', (req, res) => {
  const userId = req.session.userId;
  const listingId = req.body.listingId;
  // simulate favoriting behavior from other sites - if not already favorited, add to favorites
  // - else remove from favorites
  if (!userId) {
    res.status(401).send("Error occurred. Must be logged in to add to favorites!");
    return;
  }

  isListingFavorited(userId, listingId)
    .then((data) => {
      if (data.length > 0) {
        console.log(`Removing ${data} from favorited listings.`);
        removeFromFavorites(userId, Number(listingId));
      } else {
        console.log("Adding to favorited listings.");
        addToFavorites(userId, Number(listingId));
      }
      res.redirect('/');
    });
});

router.post('/signin', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(req.body);

  if (!email || !password) {
    console.log("Username and/or Password Empty");
    res.status(400).send("Error 400: Username and/or Password Empty.");
    return;
  }

  // Use the checkUserByEmailAndPassword function to check if email and password match
  checkUserByEmailAndPassword(email, password)
    .then(user => {
      // If user exists, log in and return to main
      if (user) {
        req.session.userId = user.id;
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;
        const templateVars = {
          userId: req.session.userId,
          firstName: req.session.firstName,
          lastName: req.session.lastName
        };
        res.render('index', templateVars);
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

router.post('/signout', (req, res) => {
  let userId = req.session.userId;
  if (userId) {
    req.session = null;
    res.redirect('/');
  }
});

/*
router.get('/users/:id', (req, res) => {
  const id = req.params.id;

  res.render('users', { id });
});
*/

router.get('/createaccount', (req, res) => {
  res.render('createaccount');
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  
  getUserDetailsWithListingsById(id)
    .then(data => {
      console.log(data);
      if (!data) {
        res.status(404).json({ error: "User not found" });
      } else {
        const templateVars = {
          searchedUserId: Number(id),
          searchedFirstName: data[0].first_name,
          searchedLastName: data[0].last_name,
          email: data[0].email,
          phoneNumber: data[0].phone_number,
          userType: data[0].user_type,
          userId: req.session.userId,
          firstName: req.session.firstName,
          lastName: req.session.lastName
        };
        res.render("user-details", templateVars);
      }
    })
    .catch(err => {
      console.error("Query Error:", err);
      res.status(500).json({ error: err.message });
    });
});


router.post('/createaccount', (req, res) => {
  let { first_name, last_name, email, password, phone_number } = req.body;

  // if one or more required field(s) left empty it will throw an error
  if (!first_name || !last_name || !email || !password || !phone_number) {
    return res.status(400).send("Error 400: One or more fields are empty.");
  }

  createaccount(
    first_name,
    last_name,
    email,
    password,
    phone_number,
  )
    .then(newUser => {

      console.log("User account created successfully!");
      res.redirect('/'); // Redirect to the home page
    })
    .catch(err => {
      console.error("Error creating user:", err);
      res.status(500).send("Error 500: Internal Server Error.");
    });
});


module.exports = router;

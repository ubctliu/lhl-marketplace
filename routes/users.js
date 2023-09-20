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

router.get('/register', (req, res) =>{
  res.render('register');
})

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
        // Redirect the user to the landing page
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
  console.log("Requested user ID:", id); 

  userQueries.getUserDetailsWithListingsById(id)
  .then(data => {
    console.log("Query Result:", data);
    if (!data) {
      res.status(404).json({ error: "User not found" });
    } else {
      const user = data;
      res.render("user-details", { user });
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

  userQueries.createaccount(
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

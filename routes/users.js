/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/connection')
const userQueries = require('../db/queries/users')
// const db = require('../db/connection')


router.get('/', (req, res) => {
  res.render('users');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.get('/register', (req, res) =>{
  console.log("helo")
  res.render('register');
})

/*
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to find the user with the provided email and password
    const user = await db.oneOrNone(
      'SELECT * FROM Users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (user) {
      // User with matching email and password found
      res.status(200).json({ message: 'Authentication successful', user });
    } else {
      // No user found with the provided username and email
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.oneOrNone(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  )
    .then((user) => {
      if (user) {
        //  // User with matching email and password found then it will redirect to user profile page.
        res.redirect(`/users/${user.id}`);
      } else {
        // If no matching user is found, it will display an error message
        res.render('signin', { error: 'Invalid email or password' });
      }
    })
    .catch((error) => {
      console.error('Error during sign-in:', error);
      res.render('signin', { error: 'An error occurred while signing in' });
    });
});
*/

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
      console.log(user);
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

router.get('/users/:id', (req, res) => {
  const id = req.params.id;

  res.render('users', { id });
});


router.get('/createaccount', (req, res) => {
  res.render('createaccount');
});
router.post('/createaccount', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const newUser = await db.one(
      'INSERT INTO Users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [first_name, last_name, email, password]
    );

    // Redirect to the user page using the newly created user's ID
    res.redirect(`/user/${newUser.id}`);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});


module.exports = router;

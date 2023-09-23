const express = require('express');
const router  = express.Router();
const post = require('../db/queries/post');
const { getUserDetailsWithListingsById } = require('../db/queries/users');

router.get("/post", (req, res) => {
  const templateVars = {
    user_type: req.session.userType,
    userId: req.session.userId,
    firstName: req.session.firstName,
    lastName: req.session.lastName
  };
  if (templateVars.user_type === 'seller') {
    res.render("post", templateVars);
  } else {
    res.redirect("/");
  }
});


router.post("/post", (req, res) => {
  console.log(req.body);
  getUserDetailsWithListingsById(req.session.userId)
    .then((data) => {
      console.log(data);
      const templateVars = {
        user_type: req.session.userType,
        userId: req.session.userId,
        firstName: req.session.firstName,
        lastName: req.session.lastName,
      };
      if (templateVars.user_type === 'seller') {
        post.posttoDB(req.body)
          .then((data) => {
            console.log(data);
            res.redirect("/");
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      }
    })
});


module.exports = router;

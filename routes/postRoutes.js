const express = require('express');
const router  = express.Router();
const post = require('../db/queries/post');

router.get("/post", (req, res) => {
  console.log("TEST");

  const templateVars = {
    user_type: req.session.user_type,
    user_id: req.session.user_id
  };
  if (user_type === 'seller') {
    res.render("post", templateVars);
  } else {
    res.redirect("/");
  }
});

 router.post("/post", (req, res) => {
  if (req.session.user_type === 'seller') {
  const listing = req.body;
  listing.user_id = req.session.user_id;
  post.posttoDB(listing)
    .then((listing) => {
      res.redirect(`/listings/${listing.id}`);
    })
    .catch(err => console.log(err));
  } else {
    res.redirect("/");
  }
});

exports.router = router;

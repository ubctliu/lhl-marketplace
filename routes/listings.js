const express = require('express');
const router  = express.Router();
const db = require('../db/connection')


// show a specific item
router.get("/:id", (req, res) => {
    
    let queryString = `
    SELECT listings.*, users.first_name AS seller_name
    FROM listings
    JOIN users ON user_id=users.id
    WHERE items.id = $1;`;

    db.query(queryString,[req.params.id])
      .then(data => {
        const item = data.rows[0];
        
        res.render("listing-detail");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
});

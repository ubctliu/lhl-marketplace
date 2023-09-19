const express = require('express');
const router  = express.Router();
const db = require('../db/connection')

// show a user's selling list
router.get("/", (req, res) => {
let queryString = `
    SELECT users.*, listings.* FROM users
    LEFT JOIN listings
    ON users.id = listings.user_id
    where users.id = $1
    ORDER BY listings.id`;

    db.query(queryString,[req.session.user_id])
      .then(data => {
        const listings = data.rows;
        console.log(listings);
        res.render("mylistings", {listings: listings});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // go to add new listing page
router.get("/new", (req, res) => {
      res.render("newlisting");
  });

  // add new listing
router.post("/", (req,res) => {
    let queryString = `
    INSERT INTO items(user_id, title, description,price,category, stock, is_featured, image_url)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `
    let queryParams = [req.session.user_id, req.body.title,  req.body.description,req.body.price, req.body.category, req.body.stock, req.body.is_featured, req.body.photo_url]
    db.query(queryString,queryParams)
    .then(data => {
      const listings = data.rows;
      //console.log(listings);
      res.redirect('/api/mylistings');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  // delete an item from user's listing
router.post('/:id/delete', (req, res) => {
    let queryString = `
    DELETE FROM listings
    WHERE user_id = $1
    AND id = $2;`;

    db.query(queryString, [req.session.user_id, req.params.id])
      .then(data => {
        res.redirect('/api/mylistings');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

  
  // edit a listing
router.post('/:id/edit', (req, res) => {

    let queryString = `UPDATE listings SET `;

    let queryParams = [];

    if(req.body.title) {
      queryParams.push(req.body.title);
      queryString += `title = $${queryParams.length}, `;
    }

    if(req.body.description) {
      queryParams.push(req.body.description);
      queryString += `description = $${queryParams.length}, `;
    }

    if(req.body.price) {
      queryParams.push(req.body.price);
      queryString += `price = $${queryParams.length}, `;
    }
    if(req.body.category) {
        queryParams.push(req.body.category);
        queryString += `category = $${queryParams.length}, `;
      }
    
    if(req.body.stock) {
        queryParams.push(req.body.stock);
        queryString += `stock = $${queryParams.length}, `;
      }
      
    if(req.body.image_url) {
        queryParams.push(req.body.image_url);
        queryString += `image_url = $${queryParams.length}, `;
      }

    queryString = queryString.slice(0, queryString.trim().length - 1);

    queryParams.push(req.params.id);
    queryString += `WHERE id = $${queryParams.length};`;

   db.query(queryString, queryParams)
      .then(data => {
        res.redirect('/api/mylistings');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
});

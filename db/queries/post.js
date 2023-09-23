const e = require('express');
const db = require ('../connection');

const posttoDB = (listing) => {
  const query = `
  INSERT INTO listings (title, description, price, category, image_url, user_id)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;
console.log(listing, "done");
return db.query(query, [listing.title, listing.description, listing.price, listing.category, listing.image_url, listing.user_id])
};

module.exports = { posttoDB };

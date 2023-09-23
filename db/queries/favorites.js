const db = require('../connection');

const addToFavorites = (userId, listingId) => {
  if (!userId) {
    return;
  }

  return db.query(`
  INSERT INTO favorites(user_id, listing_id)
  VALUES($1, $2)
  RETURNING *;`, [userId, Number(listingId)])
    .then((data) =>{
      return data.rows;
    });
};

const isListingFavorited = (userId, listingId) => {
  return db.query(`
  SELECT * FROM favorites
  WHERE user_id = $1 AND listing_id = $2;
  `, [userId, Number(listingId)])
    .then((data) => {
      return data.rows;
    });
};

const removeFromFavorites = (userId, listingId) => {
  return db.query(`
  DELETE FROM favorites
  WHERE user_id = $1 AND listing_id = $2
  RETURNING *;
  `, [userId, Number(listingId)])
    .then((data) => {
      return data.rows;
    });
};


const getAllFavoritesByUser = (userId) => {
  return db.query(`
  SELECT favorites.*, listings.*
  FROM favorites
  JOIN listings ON listing_id = listings.id
  WHERE favorites.user_id = $1;
  `, [userId])
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  addToFavorites,
  isListingFavorited,
  removeFromFavorites,
  getAllFavoritesByUser
};
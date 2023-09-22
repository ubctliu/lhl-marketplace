const db = require ('../connection')
// get an indivual list by it's id
const getListingById = (id) => {
  return db.query(`
    SELECT l.*, u.first_name, u.last_name
    FROM listings AS l
    JOIN users AS u ON l.user_id = u.id
    WHERE l.id = $1
  `, [id])
  .then((result) => {
    return result.rows[0];
  });
};
// get all listing by users
const getListingsByUser = (userId) => {
  return db.query('SELECT * FROM listings WHERE user_id = $1', [userId])
    .then((listings) => {
      return listings.rows;
    });
};

//delete listing in mylistings
const deleteListing = (listingId) => {
  return db.query('UPDATE listings SET is_deleted = true WHERE id = $1', [listingId])
  .then(() => {
  
    return 'Listing marked as deleted successfully';
  })
  .catch(error => {
    
    throw error;
  });
};

// adds new item to listings
const addListing = (userId, title, description, price, category, stock, imageUrl) => {
  return db.query(`INSERT INTO listings (user_id, title, description, price, category, stock, image_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
  [userId, title, description, price, category, stock, imageUrl])
    .then(result => {
      console.log(result.rows[0]);
      return result.rows[0];
    });
};
  
//mark items as sold
const markAsSold = (listingId) => {
  return db.query(`UPDATE listings SET name = 'SOLD', description = 'SOLD' WHERE listings.id = $1 `, [listingId])
    .then((res) => {
      console.log('listing marked as sold', res);
    });
};
  
  
//favorites queries
const addToFavorites = (userId, listingId) => {
  return db.query(`INSERT INTO favorites (user_id, listing_id)
    VALUES ($1, $2)`, [userId, listingId]);
};
  
const deleteFromFavorites = (userId, listingId) => {
  return db.query(`DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2`, [userId, listingId]);
};

module.exports = { getListingById, getListingsByUser, addListing, deleteListing, markAsSold, addToFavorites,  deleteFromFavorites };
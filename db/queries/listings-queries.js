// get an indivual list by it's id
const getListingById = (id) => {
    return db.query('SELECT * FROM listings WHERE id = $1', [id])
      .then((listing) => {
        return listing.rows[0];
      });
};
// get all listing by users
const getListingsByUser = (user_id) => {
    return db.query('SELECT * FROM listings WHERE user_id = $1', [user_id])
      .then((listings) => {
        return listings.rows;
      });
};

//delete listing in mylistings
const deleteListing = (listing_id) => {
    return db.query('DELETE FROM listings WHERE listings.id = $1', [listing_id])
      .then((res) => {
        console.log('listing deleted', res);
      });
};
  
// adds new item to listings
const addListing = (user_id, title, description, price, category, stock, image_url) => {
    return db.query(`INSERT INTO listings (user_id, title, description, price, category, stock, image_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [user_id, title, description, price, category, stock, image_url])
      .then(result => {
        console.log(result.rows[0]);
        return result.rows[0];
      });
};
  
//mark items as sold
const markAsSold = (listing_id) => {
    return db.query(`UPDATE listings SET name = 'SOLD', description = 'SOLD' WHERE listings.id = $1 `, [listing_id])
      .then((res) => {
        console.log('listing marked as sold', res);
      });
};
  
  
//favorites queries
const addToFavorites = (user_id, listing_id) => {
    return db.query(`INSERT INTO favorites (user_id, listing_id)
    VALUES ($1, $2)`, [user_id, listing_id]);
};
  
const deleteFromFavorites = (user_id, listing_id) => {
    return db.query(`DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2`, [user_id, listing_id]);
};

module.exports = { getListingById, getListingsByUser, addListing, deleteListing, markAsSold, addToFavorites,  deleteFromFavorites };
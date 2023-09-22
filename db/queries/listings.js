const db = require('../connection');

const AMOUNT_OF_NEW_FEATURED_LISTINGS = 5;
const MIN_LISTING_ID_NUMBER = 2;
const MAX_LISTING_ID_NUMBER = 32;

/**
 * Get all listings.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllListings = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT listings.*, users.first_name, users.last_name
  FROM listings
  JOIN users ON listings.user_id = users.id
  `;

  if (options.title) {
    queryParams.push(`%${options.title}%`);
    queryString += `
    WHERE listings.title LIKE $${queryParams.length} 
    `;
  }

  if (options.description) {
    queryParams.push(`%${options.description}%`);
    if (queryString.includes('WHERE')) {
      queryString += `
      AND listings.title LIKE $${queryParams.length} 
      `;
    } else {
      queryString += `
    WHERE listings.title LIKE $${queryParams.length} 
    `;
    }
  }

  if (options.minimum_price) {
    queryParams.push(Number(options.minimum_price));
    if (queryString.includes('WHERE')) {
      queryString += `
      AND listings.price >= $${queryParams.length} 
      `;
    }
    queryString += `
    WHERE listings.price >= $${queryParams.length} 
    `;
  }

  if (options.maximum_price) {
    queryParams.push(Number(options.maximum_price));
    if (queryString.includes('WHERE')) {
      queryString += `
      AND listings.price <= $${queryParams.length} 
      `;
    }
    queryString += `
    WHERE listings.price <= $${queryParams.length} 
    `;
  }

  if (options.category) {
    queryParams.push(`${options.category}`);
    if (queryString.includes('WHERE')) {
      queryString += `
      AND listings.category = $${queryParams.length} 
      `;
    } else {
      queryString += `
    WHERE listings.category = $${queryParams.length} 
    `;
    }
  }

  if (queryString.includes('WHERE')) {
    queryString += `
    AND listings.is_deleted = false
    `;
  } else {
    queryString += `
  WHERE listings.is_deleted = false 
  `;
  }

  queryParams.push(Number(limit));
  queryString += `
    LIMIT $${queryParams.length};
    `;

  return db.query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getAllFeatured = (limit = 5) => {
  const queryParams = [];
  let queryString = `
  SELECT listings.*, users.first_name, users.last_name
  FROM listings 
  JOIN users ON listings.user_id = users.id 
  WHERE listings.is_featured = true
  `;
  if (queryString.includes('WHERE')) {
    queryString += `
    AND listings.is_deleted = false
    `;
  } else {
    queryString += `
  WHERE listings.is_deleted = false 
  `;
  }
  queryParams.push(Number(limit));
  queryString += `
  LIMIT $${queryParams.length};
  `;
  return db.query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err);
    });
};

const regenerateFeaturedListings = () => {
  const generateRandomInts = (length, min, max) => {
    const randomInts = [];
    for (let i = 0; i < length; i++) {
      const randomInt = Math.floor(Math.random() * (max - min + 1) + min);
      randomInts.push(randomInt);
    }
    return randomInts;
  };

  let newListingIds = generateRandomInts(AMOUNT_OF_NEW_FEATURED_LISTINGS, MIN_LISTING_ID_NUMBER, MAX_LISTING_ID_NUMBER);
  let listingIds = [Array.from({length: MAX_LISTING_ID_NUMBER}, (_, i) => i + 2)];
  
  db.query(`
  UPDATE listings
  SET is_featured = false
  WHERE listings.id = ANY($1)
  AND is_deleted = false
  AND is_featured = true;
  `, [listingIds])
    .then(() => {
      db.query(`
  UPDATE listings
  SET is_featured = true
  WHERE listings.id = ANY($1)
  AND is_deleted = false
  AND is_featured = false;
  `, [newListingIds])
        .then(() => {
          console.log("Added new featured items successfully.");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getAllListings,
  getAllFeatured,
  regenerateFeaturedListings
};

const db = require('../connection');

/**
 * Get all listings.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllListings = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT listings.*, user_id
  FROM listings
  JOIN users ON user_id = users.id
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
    queryParams.push(${options.minimum_price});
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
    queryParams.push(${options.maximum_price});
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
      ANDlistings.category = $${queryParams.length} 
      `;
    } else {
    queryString += `
    WHERE listings.category = $${queryParams.length} 
    `;
    }
  }

  db.query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { getAllListings };

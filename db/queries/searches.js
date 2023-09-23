const db = require ('../connection')

const advSearch = (search) => {
  const query = `
  SELECT *
  FROM listings
  WHERE
      (title ILIKE $1 OR description ILIKE $2 OR category ILIKE $3)
      AND price BETWEEN $4 AND $5
  ORDER BY title;
  `;

  const values = [
    `%${search.itemName}%`,
    `%${search.descriptionWord}%`,
    search.category,
    parseFloat(search.minPrice),
    parseFloat(search.maxPrice)
  ];

  return db.query(query, values)
    .then((res) => {
      return res.rows;
    })
    .catch(err => console.log(err));
};


const regSearch = (search) => {
  const query = `
    SELECT *
    FROM listings
    WHERE title ILIKE $1
    ORDER BY title;
  `;
  const searchTerm = `%${search}%`;
  return db.query(query, [searchTerm])
    .then((res) => {
      return res.rows;
    })
    .catch(err => console.log(err));
};


module.exports = { advSearch, regSearch };

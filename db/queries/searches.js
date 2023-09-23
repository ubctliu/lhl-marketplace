const db = require ('../connection')

const advSearch = (search) => {
  const query = `
  SELECT *
  FROM listings
  WHERE
      title LIKE $1
      OR description LIKE $1
      OR category LIKE $1
  ORDER BY title;
`;
return db.query(query, [`%${search}%`])
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

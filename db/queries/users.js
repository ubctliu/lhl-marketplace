const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      console.log(data.rows);
      return data.rows;
    });
};

const getUserById = (id) => {
  return db.query('SELECT * FROM users WHERE id = $1;', [id])
    .then(user => {
      return user.rows[0];
    });
};

const getUserDetailsWithListingsById = (id) => {
  return db.query(
    'SELECT users.id, users.first_name, users.last_name, users.email, users.phone_number, users.user_type, listings.id as listing_id, listings.title, listings.description, listings.price, listings.category, listings.image_url FROM users LEFT JOIN listings ON users.id = listings.user_id WHERE users.id = $1;',
    [id]
  )
    .then(result => {
      return result.rows;
      // const userDetails = result.rows[0];
      // if (!userDetails) {
      //   return null; // User not found
      // }

      // const listings = result.rows.map(row => ({
      //   listing_id: row.listing_id,
      //   title: row.title,
      //   description: row.description,
      //   price: row.price,
      //   category: row.category,
      //   image_url: row.image_url,
      // }));

      // userDetails.listings = listings;
      // return userDetails;
    });
};



const checkUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = $1;', [email])
    .then(email => {
      // console.log(user.rows[0])
      return email.rows[0];
    });
};

const checkUserByEmailAndPassword = (email, password) => {
  const trimmedEmail = email.trim().toLowerCase();
  return db.query('SELECT * FROM users WHERE email = $1 AND password = $2;', [trimmedEmail, password])
    .then(result => {
      return result.rows[0]; // This will return the user if a match is found, otherwise null.
    });
};

const getUserIdByEmail = (email) => {
  return db.query('SELECT id FROM users WHERE email = $1;', [email])
    .then(email => {
      return email.rows[0];
    });
};

const createaccount = (first_name, last_name, email, password, phone_number) => {
  return db.query(`INSERT INTO users (first_name, last_name, email,password, phone_number)
                  VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [first_name, last_name, email, password, phone_number])
    .then(result => {
      return result.rows[0];
    });

};

module.exports = { getUsers, getUserById, getUserDetailsWithListingsById,checkUserByEmail, createaccount, getUserIdByEmail, checkUserByEmailAndPassword};
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

const checkUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = $1;', [email])
    .then(email => {
      // console.log(user.rows[0])
      return email.rows[0];
    });
};

const checkUserByEmailAndPassword = (email, password) => {
 // console.log(email, password);
 email= email.trim();
 email= email.toLowerCase();
  return db.query('SELECT * FROM users WHERE email = $1 AND password = $2;', [email, password])
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

module.exports = { getUsers, getUserById, checkUserByEmail, createaccount, getUserIdByEmail, checkUserByEmailAndPassword};
const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      console.log(data.rows);
      return data.rows;
    });
};


const checkUserByEmailAndPassword = (email, password) => {
  return db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
    .then(result => {
      return result.rows[0]; // This will return the user if a match is found, otherwise null.
    });
};

module.exports = { getUsers, checkUserByEmailAndPassword };

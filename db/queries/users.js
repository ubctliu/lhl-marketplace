const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(users => {
      return users.rows;
    });
};

const getUserById = (id) => {
  return db.query('SELECT * FROM users WHERE id = $1', [id])
    .then(user => {
      return user.rows[0];
    });
};

const checkUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(email => {
      // console.log(user.rows[0])
      return email.rows[0];
    });
};

const checkUserByEmailAndPassword = (email, password) => {
  return db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
    .then(result => {
      console.log(result);
      return result.rows[0]; // This will return the user if a match is found, otherwise null.
    });
};


const getUserIdByEmail = (email) => {
  return db.query('SELECT id FROM users WHERE email = $1', [email])
    .then(email => {
      // console.log(user.rows[0])
      return email.rows[0];
    });
};

const addUser = (email, password) => {
  return db.query(`INSERT INTO users (first_name, last_name, email,password, phone_number )
                  VALUES ('generic', 'generic', $1, $2, 999) RETURNING *`, [email, password])
    .then(result => {
      console.log(result.rows[0]);
      return result.rows[0];
    });

};

module.exports = { getUsers, getUserById, checkUserByEmail, addUser, getUserIdByEmail, checkUserByEmailAndPassword};
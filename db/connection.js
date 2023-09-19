// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = new Pool(dbParams);

db.connect(() => {
  console.log('Connected to database');
});

/*
db.query ('select * from users', (err,res) =>{
  if (!err) {
    console.log(res.rows);
  }
  else {
    console.log (err.message);
  }
  db.end
})
*/


module.exports = db;
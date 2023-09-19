// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'midterm',
};

const db = new Pool(dbParams);

db.connect().then(() => {
  console.log("Connected to Database!!");
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

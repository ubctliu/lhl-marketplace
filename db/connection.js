// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: 'localhost',
  port: 5432,
  user:'postgres',
  password: 'admin',
  database: 'midterm'
};

const db = new Pool(dbParams);

db.connect(() => {
  console.log('Connected to database');
});


module.exports = db;
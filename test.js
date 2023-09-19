//const userQueries = require ('../db/queries/users');
const db = require ('./db/connection')

db.query ('select * from users', (err,res) =>{
  if (!err) {
    console.log(res.rows);
  }
  else {
    console.log (err.message);
  }
  db.end
})
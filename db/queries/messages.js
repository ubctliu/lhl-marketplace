const db = require('../connection');

const getMessageHistoryByUserId = (userId) => {
  return db.query(`
  SELECT messages.*, listings.*, users.first_name, users.last_name
  FROM messages
  JOIN listings ON listing_id = listings.id
  JOIN users ON user_id = users.id
  WHERE receiver_id = $1
  OR sender_id = $1
  ORDER BY messages.time DESC;
  `, [userId])
    .then((data) => {
      return data.rows;
    });
};

const getMessageHistoryByBothUserIds = (userId, sellerId) => {
  return db.query(`
  SELECT messages.*, listings.*, users.first_name, users.last_name
  FROM messages
  JOIN listings ON listing_id = listings.id
  JOIN users ON user_id = users.id
  WHERE receiver_id = $1 AND sender_id = $2
  OR receiver_id = $2 AND sender_id = $1
  ORDER BY messages.time DESC;
  `, [userId, sellerId])
    .then((data) => {
      return data.rows;
    });
};

const getMessageHistoryByAllIds = (userId, sellerId, listingId) => {
  return db.query(`
  SELECT messages.*, listings.*, users.first_name, users.last_name
  FROM messages
  JOIN listings ON listing_id = listings.id
  JOIN users ON user_id = users.id
  WHERE receiver_id = $1 AND sender_id = $2 AND listings.id = $3
  OR receiver_id = $2 AND sender_id = $1 AND listings.id = $3
  ORDER BY messages.time DESC;
  `, [userId, sellerId, listingId])
    .then((data) => {
      return data.rows;
    });
};


const addMessageToDatabase = (userId, sellerId, listingId, message) => {
  return db.query(`
  INSERT INTO messages(sender_id, receiver_id, listing_id, message)
  VALUES($1, $2, $3, $4)
  RETURNING *;
  `, [userId, sellerId, listingId, message]);
};

module.exports = {
  getMessageHistoryByUserId,
  getMessageHistoryByBothUserIds,
  getMessageHistoryByAllIds,
  addMessageToDatabase
};
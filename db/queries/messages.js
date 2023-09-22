const db = require('../connection');

const getMessageHistoryByUserId = (userId) => {
  return db.query(`
  SELECT messages.*, listings.*
  FROM messages
  JOIN listings ON listing_id = listings.id
  WHERE receiver_id = $1
  OR sender_id = $1
  ORDER BY messages.time
  LIMIT 2;
  `, [userId])
    .then((data) => {
      return data.rows;
    });
};

const getMessageHistoryByBothUserIds = (userId, sellerId) => {
  return db.query(`
  SELECT messages.*, listings.*
  FROM messages
  JOIN listings ON listing_id = listings.id
  WHERE receiver_id = $1 AND sender_id = $2
  OR receiver_id = $2 AND sender_id = $1
  ORDER BY messages.time
  LIMIT 2;
  `, [userId, sellerId])
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  getMessageHistoryByUserId,
  getMessageHistoryByBothUserIds
};
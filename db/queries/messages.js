const db = require('../connection');

const getMessageHistoryByUserId = (userId) => {
  return db.query(`
  SELECT *
  FROM messages
  WHERE receiver_id = $1;
  `, [userId])
    .then((data) => {
      return data.rows;
    });
};

const getMessageHistoryByBothUserIds = (userId, sellerId) => {
  return db.query(`
  SELECT *
  FROM messages
  WHERE receiver_id = $1 AND sender_id = $2
  OR receiver_id = $2 AND sender_id = $1;
  `, [userId, sellerId])
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  getMessageHistoryByUserId,
  getMessageHistoryByBothUserIds
};
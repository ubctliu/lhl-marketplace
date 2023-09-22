const db = require ('../connection');

const posttoDB = (listing) => {
  const query = `
  INSERT INTO listings (title, description, price, category, image_url, user_id, created_at)
  VALUES($1, $2, $3, $4, $5, $6, NOW())
  RETURNING *;
`;
return db.query(query, [listing.title, listing.description, listing.price, listing.category, listing.image_url, listing.user_id])
};

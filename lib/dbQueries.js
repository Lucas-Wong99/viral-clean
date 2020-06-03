const getMyItemsQuery = `
  SELECT * FROM items
  WHERE seller_id = $1
  AND is_deleted = false;
`;

const getMessagesQuery = `
  SELECT
    y.*,
    items.name as item_name,
    items.image_url as item_image_url,
    u1.name as receiver,
    u2.name as sender
  FROM (
    SELECT DISTINCT ON (item_id)
      x.id as message_id,
      x.message_text,
      x.item_id,
      x.sent_at,
      x.receiver_id,
      x.sender_id
    FROM (
      SELECT *
      FROM messages
      ORDER BY sent_at DESC
    ) as x
    WHERE sender_id = $1
    OR receiver_id = $1
  ) as y
  JOIN items
  ON y.item_id = items.id
  JOIN users as u1
  ON u1.id = y.receiver_id
  JOIN users as u2
  ON u2.id = y.sender_id
  ORDER BY sent_at DESC;
`;

const getFavouritesQuery = `
  SELECT items.*, user_favourites.user_id
  FROM items
  JOIN user_favourites ON user_favourites.item_id = items.id
  WHERE user_id = $1
  AND items.is_deleted = FALSE;
`;

const addFavouriteQuery = `
  INSERT INTO user_favourites (user_id, item_id)
  VALUES ($1, $2);
`;

const deleteFromFavouritesQuery = `
  DELETE
  FROM user_favourites
  WHERE user_id = $1
  AND item_id = $2
  RETURNING item_id;
`;

const getAllListingsQuery = `
  SELECT items.*, user_id
  FROM items
  LEFT JOIN
    (SELECT *
      FROM user_favourites
      WHERE user_id = $1) as x
      ON items.id = x.item_id
  WHERE items.is_deleted = FALSE
  ORDER BY date_listed DESC;
`;

const filterListingsQuery = `
  SELECT items.*, user_id
  FROM items
  LEFT JOIN
    (SELECT *
      FROM user_favourites
      WHERE user_id = $1) as x
      ON items.id = x.item_id
  WHERE items.is_deleted = FALSE
`;

const createNewListingQuery = `
  INSERT INTO items (seller_id, name, description, price, image_url, city)
  VALUES ($1, $2, $3, $4, $5, $6);
`;

const getFullItemDetailsQuery = `
  SELECT items.*, users.name as seller_name, x.user_id
  FROM items
  JOIN users ON items.seller_id = users.id
  LEFT JOIN
      (SELECT *
        FROM user_favourites
        WHERE user_id = $1) as x
        ON items.id = x.item_id
  WHERE items.id = $2;
`;

const deleteListingQuery = `
  UPDATE items
  SET is_deleted = true
  WHERE id = $1
  RETURNING id
`;

const sellListingQuery = `
  UPDATE items
  SET is_sold = true
  WHERE id = $1
  RETURNING id;
`;

const getAllMessagesForItemQuery = `
  SELECT *, item_id, items.name AS item_name, items.seller_id as item_seller_id
  FROM messages
  JOIN items
  ON item_id = items.id
  WHERE item_id = $1
  ORDER BY sent_at DESC;
`;

const addNewMessageQuery = `
INSERT INTO messages (sender_id, receiver_id, item_id, message_text)
VALUES ($1, $2, $3, $4)
RETURNING *;
`;

module.exports = {
  getMyItemsQuery,
  getMessagesQuery,
  getFavouritesQuery,
  addFavouriteQuery,
  deleteFromFavouritesQuery,
  getAllListingsQuery,
  filterListingsQuery,
  createNewListingQuery,
  getFullItemDetailsQuery,
  deleteListingQuery,
  sellListingQuery,
  getAllMessagesForItemQuery,
  addNewMessageQuery
}

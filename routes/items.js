const express = require('express');
const router  = express.Router();
const { retrieveUserFromDB } = require('../lib/helpers');

module.exports = (db) => {

  // Get all listings
  router.get('/', (req, res) => {

    let query = `
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

    const userId = req.session.user_id;
    const queryParams = [userId];

    retrieveUserFromDB(db, userId)
    .then((username) => {
      db.query(query, queryParams)
      .then(data => {
        const items = data.rows;
        res.render("index", { items, username, userId });
      });
    });
  });

  //Applies the designated filters through querying the database
  router.get('/filter', (req, res) => {
    const { input_string, min_price, max_price, city, order_by } = req.query;
    let queryParams = [ req.session.user_id ];

    let query = `
      SELECT items.*, user_id
      FROM items
      LEFT JOIN
        (SELECT *
          FROM user_favourites
          WHERE user_id = $1) as x
          ON items.id = x.item_id
      WHERE items.is_deleted = FALSE
    `;

    if (input_string) {
      queryParams.push(`%${input_string}%`)
      query += `
        AND lower(items.name) LIKE lower($${queryParams.length})
      `
    }

    if (min_price) {
      queryParams.push(`${min_price * 100}`)
      query += `
        AND items.price > $${queryParams.length}
      `
    }

    if (max_price) {
      queryParams.push(`${max_price * 100}`)
      query += `
        AND items.price < $${queryParams.length}
      `
    }

    if (city) {
      queryParams.push(`%${city}%`)
      query += `
        AND lower(items.city) LIKE lower($${queryParams.length})
      `
    }

    switch (order_by) {
      case 'date':
        query += `
        ORDER BY date_listed DESC;
        `;
        break;
      case 'price_asc':
        query += `
        ORDER BY price;
        `;
        break;
      case 'price_desc':
        query += `
        ORDER BY price DESC;
        `;
        break;
    }

    const userId = req.session.user_id;

    retrieveUserFromDB(db, userId)
      .then(username => {
        db.query(query, queryParams)
        .then(data => {
          const items = data.rows;
          res.render("partials/_items_container", { items, username, userId });
        });
      })

  });

  // Gets the form that creates a new item listing
  router.get('/new', (req, res) => {
    const userId = req.session.user_id;

    retrieveUserFromDB(db, userId)
      .then((username) => {
        res.render('new_listing', { username });
      })
  });


  // Create a new listing
  router.post('/', (req, res) => {
    const query = `
    INSERT INTO items (seller_id, name, description, price, image_url, city)
    VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const { name, description, image_photo_url, city, price_for_item } = req.body;
    const queryParams = [req.session.user_id, name, description, price_for_item * 100, image_photo_url, city];
    db.query(query, queryParams)
      .then(() => {
        res.redirect('/api/myitems');
      });
  });

  // Render the full item page
  router.get('/:id', (req, res) => {

    const query = `
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
    const userId = req.session.user_id;
    const itemId = req.params.id;

    const queryParams = [userId, itemId];

    retrieveUserFromDB(db, userId)
      .then((username) => {
        db.query(query, queryParams)
        .then(data => {
          const item = data.rows[0];
          res.render('full_item', { userId, username, item });
        });
      })
  });

  // Delete an item (set is_deleted flag to true)
  router.post('/:id/delete', (req, res) => {
    const queryParams = [req.params.id];
    const query = `
      UPDATE items
      SET is_deleted = true
      WHERE id = $1
      RETURNING id;
    `;

    db.query(query, queryParams)
        .then(result => {
          res.status(200).send(result.rows[0]);
        });
  });

  // Mark an item as sold (set is_sold flag to true)
  router.post('/:id/sell', (req, res) => {
    const queryParams = [req.params.id];
    const query = `
      UPDATE items
      SET is_sold = true
      WHERE id = $1
      RETURNING id;
    `;

    db.query(query, queryParams)
        .then(result => {
          res.status(200).send(result.rows[0]);
        });
  });

  // Get all messages regarding this item and render the message_thread view
  router.get('/:id/messages', (req, res) => {
    const queryParams = [req.params.id];
    const query = `
    SELECT *, item_id, items.name AS item_name, items.seller_id as item_seller_id
    FROM messages
    JOIN items
    ON item_id = items.id
    WHERE item_id = $1
    ORDER BY sent_at DESC;
    `;

    const userId = req.session.user_id;

    retrieveUserFromDB(db, userId)
      .then((username) => {
        db.query(query, queryParams)
        .then(data => {
          const messages = data.rows;
          const item_name = data.rows[0].item_name;
          const item_seller_id = data.rows[0].item_seller_id;
          const item_id = data.rows[0].item_id;

          const receiver_id = data.rows[0].receiver_id;
          const sender_id = data.rows[0].sender_id;

          let receiverToPass;

          if (receiver_id === Number(userId)) {
            receiverToPass = sender_id;
          } else {
            receiverToPass = receiver_id;
          }

          res.render('message_thread', { messages, username, userId, item_name, item_seller_id, item_id, receiverToPass });
        });
      })
  });

  //Posts a new message to the database and then renders a partial with the data returned from the query
  router.post('/:id/messages', (req, res) => {

    const query = `
    INSERT INTO messages (sender_id, receiver_id, item_id, message_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const senderId = req.session.user_id;
    const receiverId = req.body.receiver_id;
    const message = req.body.message;
    const itemId = req.params.id;

    const queryParams = [senderId, receiverId, itemId, message];
    const userId = senderId;

    db.query(query, queryParams)
      .then(data => {
        const message = data.rows[0];
        res.render('partials/_message_inside_thread', { message, userId });
      });
  });

  return router;
};

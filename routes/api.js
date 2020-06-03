const express = require('express');
const router  = express.Router();
const { retrieveUserFromDB } = require('../lib/helpers');
const itemsRoutes = require("./items");

module.exports = (db) => {

  router.use("/items", itemsRoutes(db));

  // Login a user
  router.get('/login/:id', (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect('/');
  });

  // Get items for the user with this id
  router.get('/myitems', (req, res) => {
    const queryParams = [req.session.user_id];
    let query = `
    SELECT * FROM items
    WHERE seller_id = $1
    AND is_deleted = false;
    `;

    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      db.query(query, queryParams)
      .then(data => {
        console.log(username);
        const items = data.rows;
        res.render('my_listings', { items, username });
      });
    })


  });

  // Retrieve all messages for the current user
  router.get('/messages', (req, res) => {

    const query = `
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

    const userId = req.session.user_id;
    const queryParams = [userId];

    retrieveUserFromDB(db, userId)
    .then((username) => {
      db.query(query, queryParams)
      .then((results) => {
        const messages = results.rows;
        res.render('all_messages', { messages, username, userId });
    });
    })

  });

  // Get starred items for the current user
  router.get('/favourites', (req, res) => {

    let query = `
    SELECT items.*, user_favourites.user_id
    FROM items
    JOIN user_favourites ON user_favourites.item_id = items.id
    WHERE user_id = $1;
    `;

    const userId = req.session.user_id;
    const queryParams = [userId];

    retrieveUserFromDB(db, userId)
    .then((username) => {
      db.query(query, queryParams)
      .then(data => {
        const items = data.rows;
        console.log(items);
        res.render('favourites', { items, username });
      });
    })
  });

  // Add item to the favourites
  router.post('/favourites', (req, res) => {
    let query = `
    INSERT INTO user_favourites (user_id, item_id)
    VALUES ($1, $2);
    `;

    const queryParams = [req.session.user_id, req.body.item_id];
    db.query(query, queryParams)
      .then(() => {
        res.status(200).send('IT WORKED');
      });
  });

  // Delete item from the favourites
  router.post('/favourites/:id', (req, res) => {
    let query = `
      DELETE
      FROM user_favourites
      WHERE user_id = $1
      AND item_id = $2
      RETURNING item_id;
    `;

    const queryParams = [req.session.user_id, req.params.id];

    db.query(query, queryParams)
      .then((result) => {
        res.status(200).send(result.rows[0]);
      });
  });

  // Render the home page
  router.get('/home', (req, res) => {
    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      res.render('home', { username });
    })
  });



  return router;
};

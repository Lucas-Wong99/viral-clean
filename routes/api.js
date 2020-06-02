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

  router.get('/messages', (req, res) => {
    const queryParams = [req.session.user_id];

    const query = `
    SELECT *
    FROM (
      SELECT DISTINCT ON(item_id)
      messages.id as message_id,
      message_text,
      item_id,
      items.name as item_name,
      items.image_url as item_image_url,
      sent_at,
      receiver_id,
      users.name as receiver
    FROM messages
    JOIN items
    ON messages.item_id = items.id
    JOIN users
    ON users.id = messages.receiver_id
    WHERE sender_id = $1
    OR receiver_id = $1
    ) as y
    ORDER BY sent_at DESC;
    `;

    // FROM (
    //   SELECT *
    //   FROM messages
    //   ORDER BY sent_at DESC
    // ) as x
    const userId = req.session.user_id;
    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      db.query(query, queryParams)
      .then((results) => {
        // console.log(results.rows);
        const messages = results.rows;
        res.render('all_messages', { messages, username, userId });
    });
    })

  });

  // Get starred items for the user with this id
  router.get('/favourites', (req, res) => {
    const queryParams = [req.session.user_id];

    let query = `
    SELECT items.*, user_favourites.user_id
    FROM items
    JOIN user_favourites ON user_favourites.item_id = items.id
    WHERE user_id = $1;
    `;

    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      db.query(query, queryParams)
      .then(data => {
        const items = data.rows;
        console.log(items);
        res.render('favourites', { items, username });
      });
    })
  });

  router.post('/favourites', (req, res) => {
    console.log(req.body);
    const queryParams = [req.session.user_id, req.body.item_id];
    let query = `
    INSERT INTO user_favourites (user_id, item_id)
    VALUES ($1, $2);
    `;
    db.query(query, queryParams)
      .then(() => {
        // res.redirect('/api/favourites');
        res.status(200).send('IT WORKED');
      });
  });

  router.post('/favourites/:id', (req, res) => {
    const queryParams = [req.session.user_id, req.params.id];

    let query = `
      DELETE
      FROM user_favourites
      WHERE user_id = $1
      AND item_id = $2
      RETURNING item_id;
    `;

    db.query(query, queryParams)
      .then((result) => {
        res.status(200).send(result.rows[0]);
      });
  });

  router.get('/home', (req, res) => {
    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      res.render('home', { username });
    })
    // res.render('home', { user_id: req.session.user_id })
  });



  return router;
};

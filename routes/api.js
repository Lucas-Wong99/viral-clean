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
    WHERE seller_id = $1;
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

  // Get starred items for the user with this id
  router.get('/favourites', (req, res) => {
    const queryParams = [req.session.user_id];
    let query = `
    SELECT * FROM items
    JOIN user_favourites ON user_favourites.item_id = items.id
    WHERE user_id = $1;
    `;

    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      db.query(query, queryParams)
      .then(data => {
        console.log(username);
        const items = data.rows;
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

  router.get('/home', (req, res) => {
    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      res.render('home', { username });
    })
    // res.render('home', { user_id: req.session.user_id })
  });

  return router;
};

const express = require('express');
const router  = express.Router();
const { retrieveUserFromDB } = require('../lib/helpers');
const {
  getMyItemsQuery,
  getMessagesQuery,
  getFavouritesQuery,
  addFavouriteQuery,
  deleteFromFavouritesQuery
} = require('../lib/dbQueries');
const itemsRoutes = require("./items");

module.exports = (db) => {

  // router.use("/items", itemsRoutes(db));

  router.get("/", (req, res) => {
    res.redirect('/home');
  });

  // Login a user
  router.get('/login/:id', (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect('/');
  });

  // Get items for the user with this id
  router.get('/myitems', (req, res) => {
    const queryParams = [req.session.user_id];
    let query = getMyItemsQuery;

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

    const query = getMessagesQuery;

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

    let query = getFavouritesQuery;

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
    let query = addFavouriteQuery;

    const queryParams = [req.session.user_id, req.body.item_id];
    db.query(query, queryParams)
      .then(() => {
        res.status(200).send('IT WORKED');
      });
  });

  // Delete item from the favourites
  router.post('/favourites/:id', (req, res) => {
    let query = deleteFromFavouritesQuery;

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

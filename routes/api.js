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

  return router;
};

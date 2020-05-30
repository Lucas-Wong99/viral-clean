/*
 * All routes for Items are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /items
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get('/', (req, res) => {
    let query = `SELECT * FROM items;`
    db.query(query)
      .then(data => {
        const items = data.rows;
        res.render("index", { items });
      });
  });

  return router;
};

/*
 * All routes for Items are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /items
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { retrieveUserFromDB } = require('../lib/helpers');

module.exports = (db) => {

  router.get('/', (req, res) => {
    let query = `SELECT * FROM items;`

    retrieveUserFromDB(db, req.session.user_id)
    .then((username) => {
      db.query(query)
      .then(data => {
        const items = data.rows;
        res.render("index", { items, username });
      });
    });
  });

  //Applies the designated filters through querying the database
  router.get('/filter', (req, res) => {
    const { input_string, min_price, max_price, city, order_by } = req.query;
    let queryParams = [];

    let query = `
      SELECT * FROM items
    `;
    const check = function (array) {
      return array.length > 0 ? `AND` : `WHERE` ;
    };

    if (input_string) {
      const hasLength = check(queryParams);
      queryParams.push(`%${input_string}%`)
      query += `
        ${hasLength} name LIKE $${queryParams.length} 
      `
    }

    if (min_price) {
      const hasLength = check(queryParams);
      queryParams.push(`${min_price * 100}`)
      query += `
        ${hasLength} price > $${queryParams.length} 
      `
    }

    if (max_price) {
      const hasLength = check(queryParams);
      queryParams.push(`${max_price * 100}`)
      query += `
        ${hasLength} price < $${queryParams.length} 
      `
    }

    if (city) {
      const hasLength = check(queryParams);
      queryParams.push(`%${city}%`)
      query += `
        ${hasLength} city LIKE $${queryParams.length} 
      `
    }

    switch (order_by) {
      case 'date':
        query += `
        ORDER BY date_listed;
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
    db.query(query, queryParams)
    .then(data => {
      const items = data.rows;
      res.json(items);
    });
  });

  //Gets the form that creates a new item listing
  router.get('/new', (req, res) => {
    const userId = req.session.user_id;

    retrieveUserFromDB(db, userId)
      .then((username) => {
        res.render('new_listing', { username });
      })
  });


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

  router.get('/:id', (req, res) => {
    const userId = req.session.user_id;
    const itemId = req.params.id;
    const query = `
    SELECT items.*, users.name as seller_name
    FROM items
    JOIN users ON items.seller_id = users.id
    WHERE items.id = $1;
    `;
    const queryParams = [itemId];

    retrieveUserFromDB(db, userId)
      .then((username) => {
        db.query(query, queryParams)
        .then(data => {
          const item = data.rows[0];
          res.render('full_item', { userId, username, item });
        });
      })
  });

  return router;
};

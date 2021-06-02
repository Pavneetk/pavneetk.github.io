/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM menu_items`;
    console.log(query);
    db.query(query)
      .then(data => {
        const menu = data.rows;
        res.json({ menu });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    let query = `SELECT * FROM menu_items WHERE menu_items.id = $1;`;

    db.query(query, [req.params.id])
      .then((data) => {
        const menu = data.rows;
        res.json({ menu });
      })
      .catch((err) => {
        console.log(err.message);
        res
          .status(500)
          .json({ error: err.message });
      })
  });

  router.get("/name/:name", (req, res) => {
    let query = `SELECT menu_items.id FROM menu_items WHERE menu_items.name LIKE '%${req.params.name}%';`;
    db.query(query)
      .then((data) => {
        const menu_item = data.rows;
        res.json({ menu_item });
      })
      .catch((err) => {
        console.log(err.message,);
        res
          .status(500)
          .json({ error: err.message });
      })
  });

  router.post("/", (req, res) => {

    // let obj = {
    //            burger: 2,
    //            fries: 3,
    //            pop: 4
    //           }

    // CHANGE THE USER ID TO COOKIES (REQ.SESSION?)
    let query = ` INSERT INTO menu_items (name, price, thumbnail_picture_url, description, category) VALUES ($1, $2, $3, $4, $5);`

    console.log(query);
    db.query(query, [req.body.name, req.body.price, req.body.thumbnailPictureUrl, req.body.description, req.body.category])
      .then(data => {
        const addToMenu = data.rows;
        res.json({ addToMenu });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.put("/", (req, res) => {
    console.log(req.body);
    let query = `UPDATE menu_items SET `;
    let options = [];
    if (req.body.name) {
      options.push(req.body.name);
      query += `name = '$${options.length}' `;
    }

    if (req.body.price) {
      options.push(req.body.price);
      query += `, price = $${options.length} `;
    }

    if (req.body.thumbnailPictureUrl) {
      options.push(req.body.thumbnailPictureUrl);
      query += `, thumnailPictureURL = '$${options.length}', `;
    }

    if (req.body.description) {
      options.push(req.body.description);
      query += `, description = '$${options.length}' `;
    }

    if (req.body.category) {
      options.push(req.body.category);
      query += `, category = '$${options.length}' `;
    }

    options.push(req.body.menuItemId);
    query += `WHERE menu_items.id = $${options.length};`;
    console.log(query);

    db.query(query, options)
      .then(data => {
        const menu_items = data.rows;
        res.json({ menu_items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.delete("/", (req, res) => {
    let query = `DELETE FROM menu_items WHERE menu_items.id = $1;`;
    db.query(query, [req.body.menuItemId])
      .then(data => {
        const menu_items = data.rows;
        res.json({ menu_items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });
  return router;

};

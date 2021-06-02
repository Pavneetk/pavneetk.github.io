/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users WHERE users.id = $1;`, [req.session.user_id])
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
        .status(500)
          .json({ error: err.message });
      });
  });

  router.put("/", (req, res) => {
    console.log(req.body);
    let query = `UPDATE users SET `;
    let options = [];
    if (req.body.name) {
      options.push(req.body.name);
      query += `name = $${options.length} `;
    }
    if (req.body.phoneNumber) {
      options.push(req.body.phoneNumber);
      query += `, phone_number = $${options.length}`;
    }
    if (req.body.email) {
      options.push(req.body.email);
      query += `, email = $${options.length} `;
    }
    if (req.body.address) {
      options.push(req.body.address);
      query += `, address = $${options.length} `;
    }
    options.push(req.session.user_id);
    query += `WHERE users.id = $${options.length};`;
    console.log(options);

    db.query(query, options)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  return router;
};

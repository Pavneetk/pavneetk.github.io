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

    db.query(`SELECT users.is_owner FROM users WHERE users.id = $1;`, [req.session.user_id])
      .then(data => {
        const user = data.rows[0];
        console.log(user)
        res.json({ user });
      })
      .catch(err => {
        console.log(err.message);
        res
        .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

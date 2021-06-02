const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    let query = `SELECT *, orders.id AS order_id, CURRENT_TIMESTAMP - date AS time_in_queue, status FROM orders JOIN users ON users.id = user_id WHERE orders.status = 'paid';`
    console.log(query);
    db.query(query)
      .then(data => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.post("/", (req, res) => {
    let query = `UPDATE orders SET status = 'closed' WHERE user_id = $1 AND status = 'pending';`;
    let query2 = `INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`;

    let options = [req.session.user_id];
    console.log(req)
    if(!req.session.user_id){
      return 1;
    } else if (req.session.user_id === 1){
      console.log("you are the owner")
      return res.send("Owners can't order.");
    } else {
      db.query(query, options)
      .then(db.query(query2, options))
      .then((data) => {
        const addToOrder = data.rows;
        res.json({ addToOrder });
      })
      .catch(err => {
        console.log(err.message)
        res
          .status(500)
          .json({ error: err.message });
      });
    }

  });

    router.delete("/", (req, res) => {

      //let query = `DELETE FROM orders WHERE orders.id = $1;`;
      let query = `DELETE FROM orders WHERE orders.id = $1`;

      //db.query(query, [req.body.ordersId])
      db.query(query, [req.body.ordersId])
      .then(data => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.put("/", (req, res) => {
    let query = '';
    console.log('body:', req.body);
    if (req.body.paid === 'false') {
      query = `UPDATE orders SET status = 'pending' WHERE user_id = $1 AND status = 'open' RETURNING *;`;
    }
    if (req.body.paid === 'true') {
      query = `UPDATE orders SET status = 'paid' WHERE user_id = $1 AND status = 'pending' RETURNING *;`;
    }
    if (req.session.user_id && req.session.user_id !== 1){

     db.query(query, [req.session.user_id])
       .then(data => {
             const order = data.rows;
             res.json({ order });
             })
            .catch(err => {
                res
                  .status(500)
                  .json({ error: err.message });
                      });
      } else {
        return res.status(500);
      }
  }
  )

  return router;
}

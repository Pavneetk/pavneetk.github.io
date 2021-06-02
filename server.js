// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');



// PG database client/connection setup

const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
//  'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key"],
  })
);
app.use(cookieParser());

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const menuRoutes = require("./routes/menu");
const ordersRoutes = require("./routes/orders");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/user", userRoutes(db));
app.use("/api/menu", menuRoutes(db));
app.use("/api/orders", ordersRoutes(db));
app.use("/api/order", orderRoutes(db));

// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});


//Login a user with cookies
app.get('/login/:id/', (req, res) => {
  user_id = req.session.user_id;
  req.session.user_id = req.params.id;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  if (!req.session) {
    res.redirect('/');
  }
  req.session = null;
  res.redirect('/');
})


app.post("/sendSMS/", (req, res) => {
  //Twilio SMS config

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
   client.messages
    .create({
      body: req.body.message,
      from: "+15878023385",
      to: req.body.number
    })
    .then((message) => console.log(message))
    .done();

    res.redirect('/');
});


 app.listen(PORT, () => {
   console.log(`Example app listening on port ${PORT}`);
 });



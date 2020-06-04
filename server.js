// load .env data into process.env
// require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
// const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const cookieSession = require('cookie-session');
const morgan     = require('morgan');
const moment     = require("moment");

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

app.use(cookieSession({
  name: 'session',
  keys: ["secret", "rotation"]
}));

// Makes moment.js available globally in EJS files
app.locals.moment = moment;

// Load the logger first so all (static) HTTP requests are logged to STDOUT
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

const apiRoutes = require("./routes/api");
const itemsRoutes = require("./routes/items");

app.use("/", apiRoutes(db));
app.use("/items", itemsRoutes(db));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

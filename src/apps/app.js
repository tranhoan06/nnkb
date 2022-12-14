const express = require("express");
const app = express();
const config = require('config');
const session = require('express-session');
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
 
// view engine 
app.set("views", config.get('app').view_folder);
app.set("view engine", config.get('app').view_engine);
app.use("/static", express.static(config.get('app').static_folder));

// form 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
// session
app.set('trust proxy', 1) // trust first proxy
const sessionDriver  = session({
  secret: config.get("app").session_key ,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.get("app").session_secure }
});

app.use(sessionDriver)

app.use(require('./middlewares/cart'))
app.use(require('./middlewares/share'))
app.use(require("../routers/web"));

app.session = sessionDriver;
module.exports = app;
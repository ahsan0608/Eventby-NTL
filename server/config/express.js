/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/config/express.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 18th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) @BRL
 */

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const secret = "secret";

module.exports = (app) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser(secret));
};

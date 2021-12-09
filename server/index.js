/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/index.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 5th 2021, 11:07:57 am
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
require("./services/passport");

const { startScheduler } = require("./helpers/startScheduler");

const app = require("express")();
app.use(passport.initialize());

const DB_URL =
  "mongodb+srv://ahsan:12345@eventbydemo.9r3tq.mongodb.net/eventbydemo?retryWrites=true&w=majority";
// "mongodb+srv://user:eventdb123456@eventdb.wjtee.mongodb.net/eventByTest?retryWrites=true&w=majority";

const PORT = 4000;
require("./config/express")(app);
require("./config/routes")(app);

const main = async () => {
  try {
    await mongoose.connect(DB_URL);

    console.log(`DB Connected Successfully`);

    startScheduler();

    app.listen(PORT, () => {
      console.log(`Server app listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(`DB Connection Error: ${err}`);
    main();
  }
};

main();

require("dotenv").config();
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const dbConnection = require("./config/database");
const passport = require("passport");
require("./services/passport");

const { startScheduler } = require("./helpers/startScheduler");

const app = require("express")();

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: [keys.cookieKey],
//   })
// );
app.use(passport.initialize());
// app.use(passport.session());

const DB_URL =
  "mongodb+srv://ahsan:12345@eventbydemo.9r3tq.mongodb.net/eventbydemo?retryWrites=true&w=majority";
// "mongodb+srv://user:eventdb123456@eventdb.wjtee.mongodb.net/users?retryWrites=true&w=majority";

const PORT = 4000;

// mongoose
//   .connect(DB_URL)
//   .then(() => {
//     startScheduler();
//     require("./config/express")(app);

//     require("./config/routes")(app);

//     app.listen(PORT, console.log(`Listening on port ${PORT}!`));
//     console.log("Connected to MongoDB");
//   })
//   .catch(console.error);

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

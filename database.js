const mongoose = require("mongoose");

const { DOLLARBLUE_MONGODB_HOST, DOLLARBLUE_MONGODB_DATABASE } = process.env;

const MONGODB_URI = `mongodb://${
  DOLLARBLUE_MONGODB_HOST ? DOLLARBLUE_MONGODB_HOST : "localhost"
}/${DOLLARBLUE_MONGODB_DATABASE ? DOLLARBLUE_MONGODB_DATABASE : "dollarblue"}`;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, 
    useCreateIndex: true,
    useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false
  })
  .then((db) => console.log("Mongodb is connected to", db.connection.host))
  .catch((err) => console.error(err));
module.exports = () => {
  const mongoose = require("mongoose");
  const db = require("../config/keys").mongoURI;

  //   db config
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
      console.log("Mongo db is connect");
    })
    .catch(err => {
      console.log(err);
    });
};

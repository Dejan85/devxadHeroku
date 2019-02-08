const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

//
// ─── BODY PARSER MIDDLEWARE ─────────────────────────────────────────────────────
//

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// ─── CONNECT REACT AND NODE ─────────────────────────────────────────────────────
//

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "client/build")));
// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//
// ─── SERVER RUN ─────────────────────────────────────────────────────────────────
//

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server us up on ${PORT}`);
});

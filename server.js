const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

//
// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────────
//

//connect to db
const db = require("./models/connect");
db();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cookie parser middleware
app.use(cookieParser());

//express validator middleware
app.use(expressValidator());

//morgan middleware
app.use(morgan("dev"));

//express-jwt middleware
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//

// Project routes
const project = require("./routes/projects");
app.use("/project", project);

// auth routes
const auth = require("./routes/auth");
app.use("/admin", auth);

// users routes
const user = require("./routes/user");
app.use("/admin", user);

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

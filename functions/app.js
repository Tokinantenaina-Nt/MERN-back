require("dotenv").config({ path: "../config/.env" });
require("../config/dbConnex");
//
const express = require("express");
const app = express();
//
const postRouter = require("../routes/post.routes");
const userRouter = require("../routes/user.routes");
const { checkUser, requireAuth } = require("../middleware/auth.middleware");
const upload_checking_error = require("../middleware/uploadError.middleware");
//
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const serverless = require("serverless-http");



 
var whitelist = ['http://localhost:', '']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//
app.get("/", (req, res) => {
  res.send({ mess: "connected !!!" });
});
//jwt
app.get("/*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  if (res.locals.user) {
    res.status(200).send({ message: res.locals.user._id });
  } else {
    res.status(401).json({ message: "Utilisateur non authentifié" });
  }
});

//routes
app.use("/.netlify/functions/app/api/post", postRouter);
app.use("/.netlify/functions/app/api/user", userRouter);

//middleware upload error
app.use("*/upload", upload_checking_error);  

module.exports.handler = serverless(app);

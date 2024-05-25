const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const SECRET_TOKEN = process.env.SECRET_TOKEN;

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, `${SECRET_TOKEN}`, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const SECRET_TOKEN = process.env.SECRET_TOKEN;
  if (token) {
    jwt.verify(token, `${SECRET_TOKEN}`, async (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.locals.user = null;
        next();
      } else {
        try {
          const user = await UserModel.findById(decodedToken.id);
          console.log(decodedToken.id);
          res.locals.user = user;
          next();
        } catch (error) {
          console.error(error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    console.log("No token");
    res.locals.user = null;
    next();
  }
};

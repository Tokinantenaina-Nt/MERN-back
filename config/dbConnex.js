const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(`${MONGODB_URI}`)
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch(err => {
    console.log("Failed to connect to MongoDB " + err);
    process.exit(1);
  });

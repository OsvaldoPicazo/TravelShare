// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URL = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

console.log("MONGO_URL: ", MONGO_URL)
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
  })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

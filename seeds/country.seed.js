require('dotenv/config')
require('../config/db')

const mongoose = require("mongoose");
const Country = require("../models/Country.model");
const axios = require("axios");

axios
  .get("https://restcountries.eu/rest/v2/all")
  .then((response) => {
    return Country.create(response.data);
  })
  .then(() => {
    console.log("seed done");
    mongoose.connection.close();
  })
  .catch((err) => {
   console.log(err);
    mongoose.connection.close();
  });

var express = require('express');
var router = express.Router();

const User = require("../models/User.model")
/* GET home page. */
router.get('/', function(req, res, next) {
  User.find().then((users)=>
  res.render('index', { title: 'Express', users})
  )
});

module.exports = router;

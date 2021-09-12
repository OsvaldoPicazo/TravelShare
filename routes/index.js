var express = require('express');
var router = express.Router();

const User = require("../models/User.model")
/* GET home page. */

const isNotLoggedIn = require('../middleware/isNotLoggedIn')

/* GET home page. */
router.get('/', isNotLoggedIn, function(req, res, next) {
  User.find().then((users)=>
  res.render('index', { 
	  title: 'Sum',
	  style: 'index.css', users })
  )
});



module.exports = router;

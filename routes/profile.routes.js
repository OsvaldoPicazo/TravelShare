const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

// -----------------------------------------------------------
// 				PROFILE ROUTES
// -----------------------------------------------------------

// display user profile
router.get('/', (req, res) => {
	res.render('private/profile', {
		 user: req.session.currentUser,
		 style: 'profile.css'
		});
});

module.exports = router;
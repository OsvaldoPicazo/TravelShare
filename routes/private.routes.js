const express = require('express');
const router = express.Router();

const Trip = require('./../models/Trip.model');

router.get('/profile', (req, res) => {
	res.render('private/profile', { user: req.session.currentUser });
});

router.get('/trips/add', (req, res) => {
	res.render('trips/new-trip');
});

router.post('/trips/add', (req, res) => {

	//Get the user id from the session
	const userId = req.session.currentUser._id;

	//Get the form data from the body
	const { name, description, imageUrl } = req.body;

	console.log(name, description, imageUrl);

	Trip.create({
		name,
		description,
		imageUrl,
		participants: userId
	})
	.then((createdTrip) => {

		console.log(createdTrip)
		res.redirect('/private/trips/add');

	})
	.catch((error) => {console.log(error)})

});

module.exports = router;

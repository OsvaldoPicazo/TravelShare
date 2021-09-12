const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip.model');
const Expense = require('../models/Expense.model');

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
		res.redirect('/private/trips');

	})
	.catch((error) => {console.log(error)})

});

router.get('/trips/:id', (req, res) => {
	const  tripId  = req.params.id;

	Trip.findById(tripId)
		.populate('participants')	// participants is a property of the trip object, it is of type object and, therefore, has an id inside. populates takes the id and extracts de data from this id
		.populate({				
			path: 'expenses',		// // 2nd level populate
			populate: {
				path: 'user trip',
				populate: 'participants'
			}
		})
		.then((trip) => {
			console.log("trip: ", trip)
			res.render('trips/one-trip', { trip });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post('/trips/:id', (req, res) => {
	//GET the values
	const tripId = req.params.id;
	const { description, category, cost} = req.body; 

	Expense.create({
		description,
		category,
		cost,
		user: req.session.currentUser._id,
		trip: tripId
		})
		.then((newExpense) => {
			//console.log(newExpense);

			Trip.findByIdAndUpdate(tripId, {
				$addToSet: { expenses: newExpense._id }	// $addToSet for arrays and ensure no objects are duplicates
			})
				.then((updatedTrip) => {
					//console.log(updatedTrip);
					res.redirect(`/private/trips/${tripId}`);
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get('/profile', (req, res) => {
	res.render('private/profile', {
		 user: req.session.currentUser,
		 style: 'profile.css'
		});
});

router.get('/trips', (req, res) => {
	//Get trips from database
	Trip.find()
		.populate('participants')
		.then((trips) => {
			res.render('trips/all-trips', { trips, style: 'trips.css' });
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;

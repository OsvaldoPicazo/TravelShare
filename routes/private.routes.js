const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip.model');
const Expense = require('../models/Expense.model');
const User = require('../models/User.model');

// define object to upload file to the cloud
const fileUploader = require("../config/cloudinary")

// -----------------------------------------------------------
// 				PRIVATE REQUEST
// -----------------------------------------------------------

// add a new expense to the current trip

router.post('/trips/:id/expense', (req, res) => {
	const  tripId  = req.params.id;
	const {
		description,
		category,
		cost
	} = req.body

	Expense.create({
		description,
		category,
		cost
	})
	.then(newExpense=> {
		Trip.findByIdAndUpdate(
			tripId,
			{$push: {expenses: newExpense._id}})
			.then((trip) => {
				res.redirect(`/private/trips/${tripId}`)
			})
			.catch((error) => {
				console.log(error);
			});
	})
});

// add a new trip to the current user

router.route('/trips/add')
	.get((req, res) => {
		User.find()
		.then(allUsers => {
          res.render('trips/new-trip', {allUsers})
        }).catch((error)=> {console.log(error)})
	})
	.post(fileUploader.single("imageUrl"), (req, res) => {

		//Get the user id from the session
		const userId = req.session.currentUser._id;
		//Get the form data from the body
		const { name, description, participants} = req.body;
		
		//if no image was uploaded then define imageUrl as undefined, in this way it will take the default image from the trip model
		if (req.file === undefined) {
			var imageUrl; 	
		} else {
			const imageUrl = req.file.path;
		}

	Trip.create({
		name,
		description,
		imageUrl,
		participants
	})
	.then((createdTrip) => {
		//console.log(createdTrip)
		res.redirect('/private/trips');
	})
	.catch((error) => {console.log(error)})
});

// display a specific trip
router.get('/trips/:id', (req, res) => {
	Trip.findById(req.params.id)
	.populate("participants")
	.populate("expenses")
	// .populate({
	//	path: "expenses",
	//  populate:{}
	// })
	.then(trip=>{
		const totalExpenses = trip.expenses.reduce((sum, el) => sum + el.cost,
		0)
		trip.totalExpenses = totalExpenses
		res.render("trips/one-trip", {trip})
	})
})

// display all the trips of the current user 
router.get('/trips', (req, res) => {
	const userId = req.session.currentUser._id
	
	Trip.find({ participants: userId })
		.populate('participants')
		.then((trips) => {
			res.render('trips/all-trips', { trips, style: 'trips.css' });
		})
		.catch((error) => {
			console.log(error);
		});
});

// display user profile
router.get('/profile', (req, res) => {
	res.render('private/profile', {
		 user: req.session.currentUser,
		 style: 'profile.css'
		});
});

module.exports = router;

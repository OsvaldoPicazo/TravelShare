const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip.model');
const Expense = require('../models/Expense.model');
const User = require('../models/User.model');

// define object to upload file to the cloud
const fileUploader = require("../config/cloudinary");
const { populate } = require('../models/Trip.model');

// -----------------------------------------------------------
// 				PRIVATE REQUESTS
// -----------------------------------------------------------

// delete an expense
router.post('/trips/:id/expenses/:expenseId/delete', (req, res)=> {
	const tripId = req.params.id;
    Expense.findByIdAndDelete(req.params.expenseId)
    .then(deletedExpense => res.redirect(`/private/trips/${tripId}`))
    .catch(error=> console.log(error))
})

// edit an expense
router.route('/trips/:id/expenses/:expenseId/edit')
	.get((req, res) => {
		Expense.findById(req.params.expenseId)
		.populate("user")
		.populate("contributors")	
		.populate("trip")
		.populate({
			path: "trip",
			populate: {
				path: 'participants'
			}
		})
		.then(expense => {
			res.render('expenses/edit-expense', {expense})
		})
		.catch((error)=> {console.log(error)})
	})
	.post((req, res) => {
		const  tripId  = req.params.id;
		const {
			description,
			category,
			cost,
			contributors
		} = req.body
		Expense.findByIdAndUpdate(
			req.params.expenseId, 
			{
			description,
			category,
			cost,
			contributors
			})
		.then(updatedExpense => res.redirect(`/private/trips/${tripId}`))
		.catch((error)=> {console.log(error)})
	})

// add a new expense
router.route('/trips/:id/expenses/add')
	.get((req, res) => {
		Trip.findById(req.params.id)
		.populate("participants")
		.then(trip => {
			res.render('expenses/new-expense', {trip})
		})
		.catch((error)=> {console.log(error)})
	})	
	.post((req, res) => {
		const  tripId  = req.params.id;
		const {
			description,
			category,
			cost,
			contributors
		} = req.body

		Expense.create({
			description,
			category,
			cost,
			user: req.session.currentUser._id,
			trip: tripId,
			contributors
		})
		.then(newExpense=> {
			Trip.findByIdAndUpdate(tripId,
			{$push: {expenses: newExpense._id}})
			.then((trip) => {
				res.redirect(`/private/trips/${tripId}`)
			})
			.catch((error) => {
				console.log(error);
			});
		})
	});

// view details of an specific expense
router.get('/trips/:id/expenses/:expenseId', (req, res) => {
	Expense.findById(req.params.expenseId)
	.populate("user")
	.populate("contributors")	
	.populate("trip")
	.then(expense => {
		res.render('expenses/one-expense', {expense})
	})
	.catch((error) => {console.log(error)})
})

// add a new trip to the current user
router.route('/trips/add')
	.get((req, res) => {
		User.find()
		.then(allUsers => {
          res.render('trips/new-trip', {allUsers})
        })
		.catch((error)=> {console.log(error)})
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
		res.redirect('/private/trips');
	})
	.catch((error) => {console.log(error)})
});

// delete trip
router.post('/trips/:id/delete', (req, res)=> {
	const tripId = req.params.id;
    Trip.findByIdAndDelete(tripId)
    .then(deletedTrip => {
		console.log(deletedTrip)
		Expense.deleteMany({trip : tripId})
		.then(deletedExpenses => {
			console.log(deletedExpenses)
			res.redirect('/private/trips')
		})
		.catch(error=> console.log(error))
	})
    .catch(error=> console.log(error))
})

// edit a trip
router.route('/trips/:id/edit')
	.get((req, res) => {
		Trip.findById(req.params.id)
		.populate("participants")
	    .populate("expenses")
	    .populate({
		path: "expenses",
		populate: {
			path: 'user trip contributors'
		}
	})
		.then(trip => {
			User.find()
			.then(allUsers => {
				res.render('trips/edit-trip', {trip, allUsers})
			})
			.catch((error)=> {console.log(error)})
		})
		.catch((error)=> {console.log(error)})
	})
	.post(fileUploader.single("imageUrl"), (req, res) => {
		const tripId = req.params.id
		//Get the form data from the body
		const { name, description, participants} = req.body;
		Trip.findByIdAndUpdate(
			tripId,
			{
				name,
				description,
				participants
			})
		.then(updatedTrip => {
			res.redirect(`/private/trips/${tripId}`)
		})
		.catch((error)=> {console.log(error)})
	})

// display a specific trip
router.get('/trips/:id', (req, res) => {
	Trip.findById(req.params.id)
	.populate("participants")
	.populate("expenses")
	.populate({
		path: "expenses",
		populate: {
			path: 'user trip contributors'
		}
	})
	.then(trip=>{
		const totalExpenses = trip.expenses.reduce((sum, el) => sum + el.cost,
		0)
		trip.totalExpenses = totalExpenses
		res.render("trips/one-trip", {trip})
	})
	.catch((error) => {console.log(error)})
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

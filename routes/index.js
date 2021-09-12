var express = require('express');
var router = express.Router();

const User = require("../models/User.model")
const Trip = require('./../models/Trip.model');
const Expense = require('../models/Expense.model');
/* GET home page. */

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
					res.redirect(`/trips/${tripId}`);
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
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


/* GET home page. */
router.get('/', function(req, res, next) {
  User.find().then((users)=>
  res.render('index', { 
	  title: 'Sum',
	  style: 'home.css', users })
  )
});



module.exports = router;

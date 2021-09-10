var express = require('express');
var router = express.Router();

const User = require("../models/User.model")
const Trip = require('./../models/Trip.model');
const Review = require('./../models/Review.model');
/* GET home page. */

router.get('/trips/:id', (req, res) => {
	const { id } = req.params;
	//const tripId = req.params.id

  

	Trip.findById(req.params.id)
		.populate('owner')	// owner is property key of the room object, it has an id inside. populates takes the id and extracts de data (populates) from this id
		.populate({				// 2nd level populate
			path: 'reviews',
			populate: {
				path: 'user'
			}
		})
		.then((trip) => {
			console.log(trip)
			res.render('trips/one-trip', { trip });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post('/trips/:id', (req, res) => {
	//GET the values
	const tripId = req.params.id;
	const { comment } = req.body;

	Review.create({
		user: req.session.currentUser._id,
		comment // comment: req.body.comment
	})
		.then((newReview) => {
			console.log(newReview);

			Trip.findByIdAndUpdate(tripId, {
				$addToSet: { reviews: newReview._id }	// $addToSet for arrays and ensure no objects are duplicates
			})
				.then((updatedTrip) => {
					console.log(updatedTrip);
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
	//Get rooms from DB
	Trip.find()
		.populate('owner')
		.then((trips) => {
			res.render('trips/all-trips', { trips });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get('/', function(req, res, next) {
  User.find().then((users)=>
  res.render('index', { title: 'Sum', users })
  )
});



module.exports = router;

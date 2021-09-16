const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip.model');
const Expense = require('../models/Expense.model');
const User = require('../models/User.model');
const Balance = require('../models/Balance.model');
const axios = require("axios");

// define object to upload file to the cloud
const fileUploader = require("../config/cloudinary");
const { populate } = require('../models/Trip.model');

// import file to perform calculations
const Utils = require("../public/scripts/utils");
const utils = new Utils();

// -----------------------------------------------------------
// 				TRIP ROUTES
// -----------------------------------------------------------

// delete trip
router.post('/:id/delete', (req, res)=> {
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
router.route('/:id/edit')
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
		//This code need more work
		//Get the form data from the body
		// let image = req.params.imageUrl
		// console.log("old imageeee", image)
		// let image = req.params.imageUrl
		// let {imageUrl} = req.file.path;
		// console.log(req.body, req.file)
		// if(req.file) {
		// 	 imageUrl = req.file.path
		// } 
			// 	 imageUrl = req.file.path
			// } 
		const tripId = req.params.id
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


// add a new trip to the current user
router.route('/add')
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
		participants,
		totalExpenses : 0,
	})
	.then((createdTrip) => {
		res.redirect('/private/trips');
	})
	.catch((error) => {console.log(error)})
});

// search for a country
router.post('/country',(req, res)=>{
	const countryName = req.body.country
	axios
	.get(`https://restcountries.eu/rest/v2/name/${countryName}`)
	.then(response => {
	   const data = response.data[0];
	   res.render('countries/country-details', {
	   style: 'country-details.css', data 
	})
  })
  .catch(err => console.log(err));
})

// display a specific trip
router.get('/:id', (req, res) => {
	Trip.findById(req.params.id)
	.populate("participants")
	.populate("expenses")
	.populate({
		path: "expenses",
		populate: {
			path: 'user trip'
		}
	})
	.then(trip=>{
        Trip.findByIdAndUpdate(trip._id,
			{
                totalExpenses: utils.tripTotalExpenses(trip)
			})
		.then(updatedTrip => {
            // Balance.deleteMany({trip: updatedTrip._id})
            // .then(deletedBalances => {
            //     for(element of updatedTrip.participants) {
            //         Balance.create({
            //             user: element,
            //             trip: updatedTrip._id,
            //             amount: utils.tripPersonalBalance(updatedTrip, element)       
            //         })
            //     } 
            // })
            // .catch((error)=> {console.log(error)})

            // Generate Balances
            const balances = []
            for(const participant of trip.participants) {
                balances.push({
                    user: participant.username,
                    amount: utils.tripPersonalBalance(trip, participant._id)
                })
            }
            console.log("balancessssssssssssss: ", balances)
            res.render("trips/one-trip", {trip, balances})
        })
		.catch((error)=> {console.log(error)})
	})
	.catch((error) => {console.log(error)})
})

// display all the trips of the current user 
router.get('/', (req, res) => {
	const userId = req.session.currentUser._id
	
	Trip.find({ participants: userId })
		.populate('participants')
		.populate("expenses")
		.populate({
			path: "expenses",
			populate: {
				path: 'user trip'
			}
		})
		.then((trips) => {

			//calculate overall Expenses
			let overallExpense = 0;
			for(const eachTrip of trips) {
				overallExpense += eachTrip.totalExpenses;
			}
			res.render('trips/all-trips', { trips, overallExpense, style: 'trips.css' });
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;
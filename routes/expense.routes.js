const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip.model');
const Expense = require('../models/Expense.model');
const User = require('../models/User.model');

// import file to perform calculations
const Utils = require("../public/scripts/utils");
const utils = new Utils();

// -----------------------------------------------------------
// 				Expense Routes
// -----------------------------------------------------------

// delete an expense
router.post('/:id/delete', (req, res)=> {
	//const tripId = req.params.id;
    Expense.findByIdAndDelete(req.params.id)
    .then(deletedExpense => {
        const tripId = deletedExpense.trip
        res.redirect(`/private/trips/${tripId}`)
    })
    .catch(error=> console.log(error))
})

// edit an expense
router.route('/:id/edit')
	.get((req, res) => {
		Expense.findById(req.params.id)
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
		const {
			description,
			category,
			cost,
			contributors
		} = req.body
		Expense.findByIdAndUpdate(
			req.params.id, 
			{
			description,
			category,
			cost,
			contributors,
			partialCost : cost / contributors.length
			})
		.then(updatedExpense => {
            const tripId = updatedExpense.trip
            res.redirect(`/private/trips/${tripId}`)
        })
		.catch((error)=> {console.log(error)})
	})

// add a new expense
router.route('/:id/add')
	.get((req, res) => {
        const  tripId  = req.params.id;
		Trip.findById(tripId)
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
			contributors,
			partialCost : cost / contributors.length
		})
		.then(newExpense=> {
			Trip.findByIdAndUpdate(tripId,
			{
				$push: { expenses: newExpense._id}
                //,$inc: { totalExpenses: newExpense.cost}
			})
			.then((trip) => {
				res.redirect(`/private/trips/${tripId}`)
			})
			.catch((error) => {
				console.log(error);
			});
		})
	});
	
// view details of an specific expense
router.get('/:id', (req, res) => {
	Expense.findById(req.params.id)
	.populate("user")
	.populate("contributors")	
	.populate("trip")
	.then(expense => {
		res.render('expenses/one-expense', {expense})
	})
	.catch((error) => {console.log(error)})
})

module.exports = router;
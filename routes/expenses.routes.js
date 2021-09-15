const express = require('express');
const router = express.Router();

const Trip = require('../models/Trip.model');
const Expense = require('../models/Expense.model');
const User = require('../models/User.model');
const axios = require("axios");

// define object to upload file to the cloud
const fileUploader = require("../config/cloudinary");
const { populate } = require('../models/Trip.model');

// import file to perform calculations
const Utils = require("../public/scripts/utils");
const utils = new Utils();

// -----------------------------------------------------------
// 				Expense REQUESTS
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
		let partialCost = true;
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
			contributors,
			partialCost : cost / contributors.length
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
			contributors,
			partialCost : cost / contributors.length
		})
		.then(newExpense=> {
			Trip.findByIdAndUpdate(tripId,
			{
				$push: {expenses: newExpense._id},
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
router.get('/trips/:id', (req, res) => {
	Expense.findById(req.params.id)
	.populate("user")
	.populate("contributors")	
	.populate("trip")
	.then(expense => {
		res.render('expenses/one-expense', {expense})
	})
	.catch((error) => {console.log(error)})
})
const { Schema, model } = require('mongoose');

const tripSchema = new Schema({
	name: { 
		type: String,
		required: true
	},
	description: { 
		type: String 
	},
	// option to add an image to the trip
	imageUrl: {
		type: String,
		default: "/images/trip-1024x260.png"
	},
	// list of participants (users). Right now only the user participates in the trip. later it should be an array to have several participants
	participants: [{ 
		type: Schema.Types.ObjectId, 
		ref: 'User'
	 }],
	 // list of expenses. When creating a new trip, by default the list of expenses is empty
	expenses: [{
		type: Schema.Types.ObjectId, 
		ref: 'Expense', 
		default: []
	}],
	// total expenses 
	totalExpenses: {
		type: Number,
	}
});

const Trip = model('Trip', tripSchema);

module.exports = Trip;

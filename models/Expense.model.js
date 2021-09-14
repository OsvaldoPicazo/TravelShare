const { Schema, model } = require('mongoose');

const expenseSchema = new Schema({
	// expense description. example: Hostel in Paris
	description: {		
		type: String,
		required: true
	},
	// expense category, by default is set to general expense
	category: {
		type: String,
		enum: [
			'Accommodation',
			'Transport',
			'Food & Drink',
			'General'
		],
		default: 'General'
	},
	// total cost of the expense. Example: 50 euros
	cost: {
		type: Number,
		required: true
	},
	// The person who paid. At this moment is the same as the current use
	user: { 
		type: Schema.Types.ObjectId, 
		ref: 'User' 
	},
	// the expense always belongs to a trip. Inside this object on will find all the participants in the trip.
	trip: { 
		type: Schema.Types.ObjectId, 
		ref: 'Trip' 
	},
	// Users that took part in the expense
	contributors: [{ 
		type: Schema.Types.ObjectId, 
		ref: 'User'
	}]
});

const Expense = model('Expense', expenseSchema);

module.exports = Expense;

const { Schema, model } = require('mongoose');

const balanceSchema = new Schema({
	// the balance belongs to this user
	user: { 
		type: Schema.Types.ObjectId, 
		ref: 'User' 
	},
	// the balance is for this trip
	trip: { 
		type: Schema.Types.ObjectId, 
		ref: 'Trip' 
	},
	// balance 
	amount: {
		type: Number
	}
});

const Balance = model('Balance', balanceSchema);

module.exports = Balance;
class Utils {

    // return the sum of all expenses for a given trip
    tripTotalExpenses(trip) {
        let totalExpenses = trip.expenses.reduce((sum, el) => sum + el.cost,
		0)
        totalExpenses = Math.round(totalExpenses * 100) / 100
        return totalExpenses
    }

    // return a trip balance for a given participant
    tripPersonalBalance(trip, userId) {
        var balance = 0;
        for(const expense of trip.expenses) {
            // (+) balance = sum the cost of the expenses the participant paid for
            if (JSON.stringify(expense.user._id) === JSON.stringify(userId)) {
                balance += expense.cost
            }
            // (-) balance = subtract the partial cost of expenses in which the participant took part
            if (expense.contributors.includes(userId)) {
                balance -= expense.partialCost
            }
        }
        balance = Math.round(balance * 100) / 100
        return balance
    }
}

module.exports = Utils;
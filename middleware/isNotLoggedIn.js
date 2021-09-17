function isNotLoggedIn(req, res, next) {
	if (req.session.currentUser) {
		res.redirect('/private/trips');
	} else {
		next();
	}
}

module.exports = isNotLoggedIn;

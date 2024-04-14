const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userControllers');

var csurfProtection = csurf();
router.use(csurfProtection);

// Middleware to check if user is logged in
function isLogedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	// Handle case where req.session is not defined
	if (!req.session) {
		// Log the error or handle it as appropriate
		console.error("Session is not defined");
		return res.redirect('/');
	}
	req.session.oldUrl = req.url;
	res.redirect('/auth/login');
}

// Define routes using the isLogedIn middleware
router.get('/', isLogedIn, indexController.dash);
router.get('/results', isLogedIn, indexController.scores);
router.get('/auth/login', userController.signin);
router.get('/logout',  userController.logout);
router.get('/auth/signup', userController.signup);
router.post('/auth/login', userController.signinPost);
router.post('/auth/signup', userController.signupPost);

module.exports = router;

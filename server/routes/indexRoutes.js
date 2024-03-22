const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userControllers');

// Define the isLogedIn function
function isLogedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
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

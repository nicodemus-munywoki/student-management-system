var express = require('express');
var router = express.Router();
var csurf =require('csurf');
const passport = require('passport');
require('../config/passport')

var csurfProtection= csurf();
router.use(csurfProtection);



exports.logout = async(req, res, next) => {
  req.logout(function(err) {
	if (err) {
	  return next(err);
	}
  res.redirect('/');
  });
};

router.use('/', notLogedIn, function(req, res, next){
  next();
});

/* GET users listing. */
exports.signup = async(req, res,next) => {
  var messages = req.flash('error');
  res.render('auth/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
};

exports.signupPost = passport.authenticate('local.signup', {
	failureRedirect: '/auth/signup',
	failureFlash: true
}, async (req, res, next) => {
	if (req.session.oldUrl) {
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/');
	}
});


exports.signin = async(req, res, next) => {
  var messages = req.flash('error');
  res.render('auth/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
};

exports.signinPost = passport.authenticate('local.login',{
  failureRedirect: '/auth/login',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
	var oldUrl = req.session.url;
	res.redirect(oldUrl);
  } else{
	res.redirect(oldUrl);
  }
};

// module.exports = router;

function isLogedIn(req, res, next){
  if(req.isAuthenticated()){
	return next();
  }
  res.redirect('/');
}

function notLogedIn(req, res, next){
  if(!req.isAuthenticated()){
	return next();
  }
  res.redirect('/');
}
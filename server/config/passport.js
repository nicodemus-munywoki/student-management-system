var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id)
		.then(function(user){
			return done(null, user);
		})
		.catch(function(err){
			return done(err);
		});
});

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email})
		.then(function(user){
			if(user){
				return done(null, false, {message: 'Email already in use.'});
			}
			var newUser = new User();
			newUser.email = email;
			newUser.password = newUser.encryptPassword(password);
			newUser.fname = req.body.fname;
			newUser.sname = req.body.sname;
			newUser.role = 'user';
			return newUser.save();
		})
		.then(function(result){
			return done(null, result);
		})
		.catch(function(err){
			return done(err);
		});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email})
		.then(function(user){
			if(!user){
				return done(null, false, {message: 'No user with this username found.'});
			}
			if(!user.validPassword(password)){
				return done(null, false, {message: 'Wrong password.'});
			}
			return done(null, user);
		})
		.catch(function(err){
			return done(err);
		});
}));
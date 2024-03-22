require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const validator = require('express-validator'); // Uncommented this line
const flash = require('connect-flash');
const createError = require('http-errors');
const connectDB = require('./server/config/db');

const mongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3200;

connectDB();
require('./server/config/passport');

app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: false,
		store: mongoStore.create({mongoUrl: process.env.MONGODB_URI}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7
		},
	})
)

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(validator()); // Uncommented this line
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use(flash());

app.use(expressLayout);
app.set('layout', './layouts/indexLayout');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/indexRoutes'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('404');
});

app.listen(port, () => {
	console.log(`Port: ${port}`)
});

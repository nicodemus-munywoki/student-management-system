// const User = require('../models/user');
exports.dash = async (req, res) => {
	const currentUser = req.user;
  res.render('dash', { user: currentUser });
}
exports.scores = async (req, res) =>{
	res.render('student/results');
};
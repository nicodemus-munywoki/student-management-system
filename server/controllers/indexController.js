exports.dash = async (req, res) => {
  res.render('dash');
}
exports.scores = async (req, res) =>{
	res.render('student/results');
};
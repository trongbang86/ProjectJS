module.exports = function(Project){
	return {
		homepage: function(req, res, next) {
		  res.render('index', { title: 'Express' });
		}
	}
}
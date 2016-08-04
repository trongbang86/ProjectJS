var util = require('util');

module.exports = function(Project){
	return {
		homepage: homepage,
		formAction: formAction
	}
}

function homepage(req, res, next) {
	res.render('index', {});
}

function formAction(req, res, next) {
	res.render('formAction', {params: req.body});
}
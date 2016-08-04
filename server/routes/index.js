var express 	= require('express'),
	router 		= express.Router();



module.exports = function(Project){
	
	/* GET home page. */
	router.get('/', Project.Helpers.controllers.homepage);

	router.post('/form.action', Project.Helpers.controllers.formAction);

	return {
		router 	: router,
		base	: '/'
	};
};


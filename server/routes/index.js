var express 	= require('express'),
	router 		= express.Router();



module.exports = function(Project){
	
	/* GET home page. */
	router.get('/', Project.Helpers.controllers.homepage);

	return {
		router 	: router,
		base	: '/'
	};
};


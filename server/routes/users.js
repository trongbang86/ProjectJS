var express 	= require('express'),
	router 		= express.Router(),
	Project 	= null;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = function(__Project__){
	Project = __Project__;

	return {
		router 	: router,
		base	: '/user'
	};

};
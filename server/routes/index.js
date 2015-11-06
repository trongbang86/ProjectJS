var express 	= require('express'),
	router 		= express.Router(),
	Project		= null;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = function(__Project__){
	Project = __Project__;
	
	return {
		router 	: router,
		base	: '/'
	};
};


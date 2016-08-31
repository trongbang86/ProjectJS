/* registering global variables as testing utilities */
global._ 		= require('lodash');
global.expect	= require('chai').expect;
var ProjectJS	= require('../../config/bootstrap.js');

before(function(){
	/* loading the environment */
	process.env.NODE_ENV= 'test';
	var app = require('../../app.js');
	global.TestProject = app.Project;

	function runSeed(file) {
		console.log(file);
	}
});

after(function(){
	global.TestProject.shutdown();
	delete global['TestProject'];
});

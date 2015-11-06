/* registering global variables as testing utilities */
global._ 		= require('underscore');
global.expect	= require('chai').expect;

before(function(){
	/* loading the environment */
	process.env.NODE_ENV= 'test';
	var app = require('../../app.js');
	global.TestProject = app.Project;
});
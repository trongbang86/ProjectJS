/* registering global variables as testing utilities */
global._ 		= require('underscore');
global.expect	= require('chai').expect;

before(function(){
	/* loading the environment */
	process.env.NODE_ENV= 'test';
	var app = require('../../app.js');
	global.TestProject = app.Project;
});

after(function(){

	/* Defining hooks when server is shutdown */
	// listen for TERM signal .e.g. kill 
	process.on ('SIGTERM', TestProject.shutdown);

	// listen for INT signal e.g. Ctrl-C
	process.on ('SIGINT', TestProject.shutdown); 
});
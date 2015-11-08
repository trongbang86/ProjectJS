/* registering global variables as testing utilities */
global._ 		= require('underscore');
global.expect	= require('chai').expect;
var ProjectJS	= require('../../config/bootstrap.js');

before(function(){
	/* loading the environment */
	process.env.NODE_ENV= 'test';
	var app = require('../../app.js');
	global.TestProject = app.Project;
});

/* Defining hooks when server is shutdown */
// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', function(){
  ProjectJS.Projects.shutdown(process.exit);
});

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', function(){
  ProjectJS.Projects.shutdown(process.exit);
}); 
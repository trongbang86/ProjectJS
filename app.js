var debug			= require('debug')('ProjectJS');
var express 		= require('express');

var serverSettings 	= express();

/** This is the heart of all project-related settings
 *	the global.Project is passed into bootstrap.js to
 *	avoid loading the Project setting object again.
 *	This happens when using gulp run
 */

debug('Calling bootstrap.js to set serverSettings');

var ProjectJS = require('./config/bootstrap.js'),
    Project 	= ProjectJS(serverSettings),
    logger    = Project.logger;


/* Defining hooks when server is shutdown */
// listen for TERM signal .e.g. kill 
debug('Defining hooks when server is shutdown');
process.on ('SIGTERM', function(){
  ProjectJS.Projects.shutdown(process.exit);
});

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', function(){
  ProjectJS.Projects.shutdown(process.exit);
}); 

module.exports = {
  serverSettings: serverSettings,
  Project: Project
};

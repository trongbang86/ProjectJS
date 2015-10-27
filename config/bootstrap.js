/*
This is the heart of the project-specific settings
params:
 - express: the server running this project
*/
module.exports = function(express){
	var project = {};
	var path = require('path');

	/* Defining extra utilities*/
	project.env = process.env.NODE_ENV || 'development';
	project.ROOT_FOLDER = path.join(__dirname, "..");

	/* Using nconf to get custom settings for different environments */
	var nconfInstance = require(__dirname + "/env").call(project);
	cloneProperties(nconfInstance, project);

	

	return project;
};

function cloneProperties(nconf, project) {
	project.database = nconf.get('database');
}
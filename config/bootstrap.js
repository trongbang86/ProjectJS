/*
This is the heart of the project-specific settings
params:
 - express: the server running this project
*/
module.exports = function(express){
	var project = {};
	var path = require('path');
	project.ROOT_FOLDER = path.join(__dirname, "..");

	var nconfInstance = require(__dirname + "/env").call(project);
	cloneProperties(nconfInstance, project);
	return project;
};

function cloneProperties(nconf, project) {
	project.database = nconf.get('database');
}
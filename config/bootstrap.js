/**
 * This throws error if env === 'default'
 * @param env the value of the current environment
 */
function denyDefaultEnv(env) {
	if (env==='default') {
		throw Error("Environment can't be set to 'default'");
	};
};

/**
 * This is the heart of the project-specific settings
 * @param express the server running this project
 */
module.exports = function(express){
	var env = process.env.NODE_ENV || 'development';
	
	denyDefaultEnv(env);
	
	var project = {};
	var path = require('path');

	/* Defining extra utilities*/
	project.env = env;
	project.ROOT_FOLDER = path.join(__dirname, "..");

	/* Using nconf to get custom settings for different environments */
	var nconfInstance = require(__dirname + "/env").call(project);
	cloneProperties(nconfInstance, project);

	

	return project;
};

/**
 * This copies value from nconf to project so that
 * we don't have to use get() for each property
 * @param nconf
 * @param project
 */
function cloneProperties(nconf, project) {
	project.database = nconf.get('database');
	project.denyDefaultEnv = denyDefaultEnv;
}
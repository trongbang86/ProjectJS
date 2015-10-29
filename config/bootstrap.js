var path = require('path');

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
 * @return project {}
 *		- env
 *		- ROOT_FOLDER
 *		- database
 *		- gulp
 *		- denyDefaultEnv
 *		- routes
 */
module.exports = function(express){
	/* Defining global utilities */
	global._ = require('underscore');

	/* Setting up all variables */
	var env = process.env.NODE_ENV || 'development';
	
	denyDefaultEnv(env);
	
	var project = {};

	/* Defining extra utilities*/
	project.env = env;
	project.ROOT_FOLDER = path.join(__dirname, "..");

	/* Using nconf to get custom settings for different environments */
	var nconfInstance = require(__dirname + "/env").call(project);
	cloneProperties(nconfInstance, project);

	/* Defining routes */
	project.routes = {};
	__loadRoutes__(project, express);

	return project;
};

/**
 * This copies value from nconf to project so that
 * we don't have to use get() for each property
 * @param nconf
 * @param project
 */
function cloneProperties(nconf, project) {
	project.database 	= nconf.get('database');
	project.gulp			= nconf.get('gulp');
	/* This function is assigned for testing purposes */
	project.denyDefaultEnv = denyDefaultEnv;
}

/**
 * This loads automatically all the routes
 * by looping through routes folder
 * @param project the project setting object
 * @param express the server running this project
 */
function __loadRoutes__(project, express) {
	var fs = require('fs');
	var routesFolder = path.join(project.ROOT_FOLDER, 'routes');
	var routeFiles = fs.readdirSync(routesFolder);
	_.each(routeFiles, function(file){
		var routeDefinition = require(path.join(routesFolder, file));
		express.use(routeDefinition.base, routeDefinition.router);
		project.routes[routeDefinition.base] = routeDefinition.router;
	});
}
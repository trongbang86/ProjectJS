var path 		= require('path'),
	express		= require('express');

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
 * @param server the server running this project
 * @return project {}
 *		- env
 *		- ROOT_FOLDER
 *		- database
 *		- gulp
 *		- denyDefaultEnv
 *		- routes
 */
module.exports = function(server){
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
	__cloneProperties__(nconfInstance, project);
	
	/* if express server is passed in, we set up specific
	 * settings for the server
	 */
	if(server){
		__applyServerSetup__(project, server);
	}

	return project;
};

/**
 * This sets up settings for server
 * @param project the project setting object
 * @param server the server running
 */
function __applyServerSetup__(project, server){

	/* Defining routes */
	project.routes = {};
	__loadRoutes__(project, server);
	
	/* Defining static routes */
	server.use('/static/js', 
			express.static(project.gulp.tmpJavascriptFolder));
	
	server.use('/static/stylesheets',
			express.static(project.gulp.tmpStyleSheetFolder));
	
	server.use('/static/vendor',
			express.static(project.gulp.tmpVendorFolder));
	
}

/**
 * This copies value from nconf to project so that
 * we don't have to use get() for each property
 * @param nconf
 * @param project
 */
function __cloneProperties__(nconf, project) {
	project.database 	= nconf.get('database');
	project.gulp			= nconf.get('gulp');
	__addRootFolder__(project, project.gulp);
	/* This function is assigned for testing purposes */
	project.denyDefaultEnv = denyDefaultEnv;
}

/**
 * This loads automatically all the routes
 * by looping through routes folder
 * @param project the project setting object
 * @param server the server running this project
 */
function __loadRoutes__(project, server) {
	var fs = require('fs');
	var routesFolder = path.join(project.ROOT_FOLDER, 'server', 'routes');
	var routeFiles = fs.readdirSync(routesFolder);
	_.each(routeFiles, function(file){
		var routeDefinition = require(path.join(routesFolder, file));
		server.use(routeDefinition.base, routeDefinition.router);
		project.routes[routeDefinition.base] = routeDefinition.router;
	});
}

/**
 * This loops through the map and prefixes
 * ROOT_FOLDER to any entry with the key /Folder$/
 * so they can become absolute paths
 * @param project the project setting object
 * @param gulpDef project.gulp a list of gulp related settings
 */
function __addRootFolder__(project, gulpDef){
	var keys = _.keys(gulpDef);
	_.each(keys, function(key){
		if(/Folder$/.test(key)){
			gulpDef[key] = path.join(project.ROOT_FOLDER, 
					gulpDef[key]);
		}
	});
}
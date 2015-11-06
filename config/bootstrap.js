var path 		= require('path'),
	express		= require('express'),
	fs 			= require('fs'),
	_			= require('underscore');
/**
 * This throws error if env === 'default'
 * @param env the value of the current environment
 */
function __denyDefaultEnv__(env) {
	if (env==='default') {
		throw Error("Environment can't be set to 'default'");
	};
};

/**
 * This is the heart of the project-specific settings
 * @param serverSettings the server running this project
 * @param returnProject the object to be returned
 * 				This is used when this bootstrap.js file
 * 				is called multiple times
 * @return project {}
 *		- env
 *		- ROOT_FOLDER
 *		- database
 *		- gulp
 *		- denyDefaultEnv
 *		- routes
 *		- Models
 *			- Any models defined under server/models
 *			- __knex__ the instance of knex created for all the models
 */
module.exports = function(serverSettings, returnProject){
	
	/* If returnProject is passed in, it means
	 * the intialisation process has taken earlier
	 */
	if(returnProject){
		return returnProject;
	}

	/* Setting up all variables */
	var env = process.env.NODE_ENV || 'development';
	
	__denyDefaultEnv__(env);
	
	var project = __initialise__(env);
	
	/* if express server is passed in, we set up specific
	 * settings for the server
	 */
	if(serverSettings){
		__applyServerSetup__(project, serverSettings);
	}

	return project;
};

/**
 * This does the work of defining the project setting object
 * @param env the current running environment
 */
function __initialise__(env){
	var project = {};

	/* Defining extra utilities*/
	project.env = env;
	project.ROOT_FOLDER = path.join(__dirname, "..");
	
	/* Using nconf to get custom settings for different environments */
	var nconfInstance = require(__dirname + "/env").call(project);
	__cloneProperties__(nconfInstance, project);

	/* Loading models */
	__loadModels__(project);
	
	return project;
}

/**
 *	This loads all the models
 */
function __loadModels__(project){
	project.Models 	= {};
	var knexfile	= path.join(project.ROOT_FOLDER, 'config', 'knexfile.js'),
		config 		= require(knexfile)()[project.env];
	
	var	knex 		= require('knex')(config);

	project.Models.__knex__ = knex;

	var bookshelf 	= require('bookshelf')(knex);
	var modelFolder = path.join(project.ROOT_FOLDER, 
						'server', 'models');		

	var modelFiles 	= _.chain(fs.readdirSync(modelFolder))
						.filter(function(file){
							return fs.lstatSync(path.join(modelFolder, file)).isFile();
						})
						.map(function(file){
							return path.join(modelFolder, file);
						})
						.value();

	_.each(modelFiles, function(file){
		var name = path.basename(file).replace('.js', ''); //removing the extension too
		project.Models[name] = require(file)(project, bookshelf);
	});
}

/**
 * This sets up settings for server
 * @param project the project setting object
 * @param serverSettings the server running
 */
function __applyServerSetup__(project, serverSettings){

	/* Defining routes */
	project.routes = {};
	__loadRoutes__(project, serverSettings);
	
	/* Defining static routes */
	serverSettings.use('/static/js', 
			express.static(project.gulp.tmpJavascriptFolder));
	
	serverSettings.use('/static/stylesheets',
			express.static(project.gulp.tmpStyleSheetFolder));
	
	serverSettings.use('/static/vendor',
			express.static(project.gulp.tmpVendorFolder));
	
}

/**
 * This defines what happens when server is shutdown
 * @param project the project setting object
 */
function shutdown(project){
	return function(){
		console.log('Destroying connection pools used by knex');
		project.Models.__knex__.destroy(function(){	
			console.log('Finished destroying connection pools used by knex');
			
		});
	};
}

/**
 * This copies value from nconf to project so that
 * we don't have to use get() for each property
 * @param nconf
 * @param project
 */
function __cloneProperties__(nconf, project) {
	project.database 		= nconf.get('database');
	project.gulp			= nconf.get('gulp');
	project.timeOutShutdown	= nconf.get('timeOutShutdown');
	project.shutdown 		= shutdown(project);
	__addRootFolder__(project, project.gulp);
	/* This function is assigned for testing purposes */
	project.__denyDefaultEnv__ = __denyDefaultEnv__;
}

/**
 * This loads automatically all the routes
 * by looping through routes folder
 * @param project the project setting object
 * @param serverSettings the server running this project
 */
function __loadRoutes__(project, serverSettings) {
	var routesFolder = path.join(project.ROOT_FOLDER, 'server', 'routes');
	var routeFiles = fs.readdirSync(routesFolder);
	_.each(routeFiles, function(file){
		var routeDefinition = require(path.join(routesFolder, file))(project);
		serverSettings.use(routeDefinition.base, routeDefinition.router);
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
var	Promise				= require('bluebird'),
	_ 					= require('underscore'),
	__AllProjectsShutdownCalled__ = false,
	Projects 			= [];


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
 * It looks up the environment from process.env.NODE_ENV and 
 *		sets up all the dependencies accordingly
 * 
 * @param serverSettings the server running this project
 * @param options a dictionary to give extra options
 *		- project: the object to be returned
 * 				This is used when this bootstrap.js file
 * 				is called multiple times.
 *				If this is given, the initialisation is skipped
 *		- env: To override the process.env.NODE_ENV
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
 *		- customLogLevels
 *		- rootLogFolder
 *		- logFolder
 *		- appLogFolder
 *		- accessLogFolder
 */
module.exports = function(serverSettings, options){
	
	/* To avoid null error */
	options = options || {};

	/* If project is passed in, it means
	 * the intialisation process has taken earlier
	 */
	if(options.project){
		return options.project;
	}

	/* Setting up all variables */

	var env = options.env || process.env.NODE_ENV || 'development';

	__denyDefaultEnv__(env);
	
	var project = require('./__bootstrapProject__.js')(env);
	
	/* This function is assigned for testing purposes */
	project.__denyDefaultEnv__ = __denyDefaultEnv__;
	
	/* if express server is passed in, we set up specific
	 * settings for the server
	 */
	if(serverSettings){
		require('./__bootstrapServer__.js')(project, serverSettings);
	}

	/*
	 * Registering this project instance so that
	 * we can shut down all connections gracefully
	 * when exiting
	 */
	Projects.push(project);

	return project;
};

/*
 * Exposing all the project instances which is accessible by
 * require('config/bootstrap.js').Projects
 */
module.exports.Projects = Projects;
Projects.shutdown 		= shutdown;

/**
 * This is used to shut down all project instances
 * @param cb the callback function
 */
function shutdown(cb){
	//Only call this for the first time
	if(!__AllProjectsShutdownCalled__){
		__AllProjectsShutdownCalled__ = true;

		var shutdownPromises = [];
		_.each(Projects, function(project){
			shutdownPromises.push(project.shutdown());
		});

		Promise.all(shutdownPromises).
			then(function(){
				if(cb) {
					cb();
				}
			})
	}
}
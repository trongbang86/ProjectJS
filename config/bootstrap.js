var path 				= require('path'),
	fs 					= require('fs'),
	morgan				= require('morgan'),
	_					= require('underscore'),
	Promise				= require('bluebird'),
	__AllProjectsShutdownCalled__ = false,
	Projects 			= [];


/* setting custom logger */
var customLogLevels = {
	error: 1,
	warn: 2,
	debug: 3,
	info: 4,
	verbose: 5,
	silly: 6
};

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
	
	var project = __initialise__(env);
	
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

	/* Loading logger */
	__loadLogger__(project);
	
	return project;
}

/**
 * This loads logger for the project
 * @param project the project setting object
 */
function __loadLogger__(project){

	/* create log directory if not exist */
	fs.existsSync(project.rootLogFolder) || fs.mkdirSync(project.rootLogFolder);
	fs.existsSync(project.logFolder) || fs.mkdirSync(project.logFolder);
	fs.existsSync(project.appLogFolder) || fs.mkdirSync(project.appLogFolder);

	var winston = require('winston'),
		logger 	= new winston.Logger({
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({
						filename: path.join(project.appLogFolder, 'app.log'),
						maxsize: 5000000,
						json: false,
						level: 'info',
						json: false,
						handleExceptions: true,
	    				humanReadableUnhandledException: true

				})
			],
			levels: customLogLevels,
  			exitOnError: false

		});

	project.logger = logger;
	project.customLogLevels = customLogLevels;
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
 * This is used to shutdown individual project instance
 * @param project the project setting object
 * @param cb what next to be done
 */

function __shutdown__(project){
	return function(){
		return new Promise(function(resolve, reject){
			console.log('Destroying connection pools used by knex for the environment ' 
				+ project.env);

			project.Models.__knex__.destroy(function(){
				console.log('Finished destroying connection pools used by knex' + 
								' for the environment ' + project.env);
				resolve();
			})
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
	project.rootLogFolder 	= path.join(project.ROOT_FOLDER, 
									nconf.get('rootLogFolder'));
	project.logFolder 		= path.join(project.rootLogFolder, project.env);
	project.appLogFolder 	= path.join(project.logFolder, 'app');
	project.accessLogFolder	= path.join(project.logFolder, 'access');

	project.shutdown 		= __shutdown__(project);
	__addRootFolder__(project, project.gulp);
	/* This function is assigned for testing purposes */
	project.__denyDefaultEnv__ = __denyDefaultEnv__;
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
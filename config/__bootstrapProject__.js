var path 				= require('path'),
	fs 					= require('fs'),
	_					= require('underscore'),
	common				= require('./__common__.js')(),
	debug				= require('debug')('ProjectJS');

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
 * This does the work of defining the project setting object
 * @param env the current running environment
 */
 module.exports = function(env){
 	debug('Setting up Project object with env=' + env);
 	var project = {};

	/* Defining extra utilities*/
	project.env = env;
	project.ROOT_FOLDER = path.join(__dirname, "..");
	
	/* Using nconf to get custom settings for different environments */
	var nconfInstance = require(__dirname + "/env").call(project);
	__cloneProperties__(nconfInstance, project);

	/* Loading models */
	if (!project.noDatabase) {
		__loadModels__(project);	
	} else {
		debug("noDatabase flag is turned on. Project.Models will be empty.");
		project.Models = {};
	}
	
	/* Loading logger */
	__loadLogger__(project);

	/* Loading services */
	__loadServices__(project);

	/* Loading helpers */
	__loadHelpers__(project);
	
	return project;

};

/**
 * This loads all the helpers
 * @param project the project setting object
 */
function __loadHelpers__(project){
	debug('Loading Helpers');
	var helpers = project.Helpers = {};
	var wrench = require('wrench');
	var helperFolder = path.join(project.ROOT_FOLDER, 
								'server', 'helpers');
	var helperFiles = wrench.readdirSyncRecursive(helperFolder);

	_.each(helperFiles, function(file){
		debug('Processing Helper File:' + file);
		var components = file.split(path.sep); // ['path1', 'path2', 'file.js']
		var folders	= components.slice(0, components.length -1); // ['path1', 'path2']
		var fileName = components[components.length - 1];
		var ext = path.extname(fileName).substring(1);
		if(ext === 'js'){
			debug('Loading Helper File:' + file);
			var currModule = helpers;
			_.each(folders, function(folder){
				if (! currModule[folder]) {
					currModule[folder] = {};
				}
				currModule= currModule[folder];
			});
			var customMethods = common.require(path.join(helperFolder, file), project);
			_.extend(currModule, customMethods);
		} else {
			debug('Helper File: \'' + file + '\' is not a .js file');
		}
	});
}

/**
 * This loads logger for the project
 * @param project the project setting object
 */
function __loadLogger__(project){
	debug('Loading logger');
	/* create log directory if not exist */
	fs.existsSync(project.rootLogFolder) || fs.mkdirSync(project.rootLogFolder);
	fs.existsSync(project.logFolder) || fs.mkdirSync(project.logFolder);
	fs.existsSync(project.appLogFolder) || fs.mkdirSync(project.appLogFolder);

	var winston = require('winston'),
		logger 	= new winston.Logger({
			transports: [
				new winston.transports.Console({
						level: 'info',
						json: false,
						handleExceptions: true,
	    				humanReadableUnhandledException: true
				}),
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
			levels: customLogLevels

		});

	project.logger = logger;
	project.customLogLevels = customLogLevels;
}

/**
 * This loads all the services
 * @param project the project setting object
 */
function __loadServices__(project){
	debug('Loading Services');
	project.Services = {};

	var serviceFolder = path.join(project.ROOT_FOLDER, 'server', 'services');

	var serviceFiles = _.chain(fs.readdirSync(serviceFolder))
						.filter(function(file){
							return fs.lstatSync(path.join(serviceFolder, file)).isFile();
						})
						.map(function(file){
							return path.join(serviceFolder, file);
						})
						.value();

	_.each(serviceFiles, function(file){
		var name = path.basename(file).replace('.js', ''); //removing the extension too
		project.Services[name] = common.require(file, project);
	});
}

/**
 *	This loads all the models
 */
function __loadModels__(project){
	debug('Loading models');
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
		project.Models[name] = common.require(file, [project, bookshelf]);
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
			if (! project.alreadyShutdown){
				project.alreadyShutdown = true;
				debug('Destroying connection pools used by knex for the environment ' 
					+ project.env + '\n');

				if(project.Models.__knex__) {
					project.Models.__knex__.destroy(function(){
						debug('Finished destroying connection pools used by knex' + 
										' for the environment ' + project.env + '\n');
						resolve();
					})
				} else {
					debug('There seems to be no database connection has been set up.' +
						'No need to close __knex__. \n');
					resolve();
				}
			} else {
				debug('Already shutdown this project.\n');
				resolve();
			}
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
	project.port 			= nconf.get('port');
	project.noDatabase		= nconf.get('noDatabase') || false;

	project.shutdown 		= __shutdown__(project);
	__addRootFolder__(project, project.gulp);
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

var fs 				= require('fs'),
	path			= require('path'),
	morgan			= require('morgan'),
	express			= require('express'),
	_ 				= require('underscore'),
	winston			= require('winston'),
	favicon 		= require('serve-favicon'),
	cookieParser 	= require('cookie-parser'),
	bodyParser 		= require('body-parser'),
	common			= require('./__common__.js')(),
	wrench			= require('wrench'),
	debug			= require('debug')('ProjectJS'),
	handlebars		= require('hbs');

/**
 * This sets up settings for server
 * @param project the project setting object
 * @param serverSettings the server running
 */
module.exports = function (project, serverSettings){

	/* Defining routes */
	project.routes = {};

	var logger = project.logger;

	debug('Setting up Cross Origin Resource Sharing');
	serverSettings.use(function(req, res, next) {
		debug('Adding header for CORS');
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		next();
	});

	/* Setting up access logging */
	
	var accessLogStream = __getAccessLogStream__(project);
	serverSettings.use(morgan('dev', {
							stream: accessLogStream
						}));

	debug('Setting up view engine for express');
	// view engine setup
	__setView__(project, serverSettings);

	// uncomment after placing your favicon in /public
	//serverSettings.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	debug('Setting up bodyParser and cookieParser');
	serverSettings.use(bodyParser.json());
	serverSettings.use(bodyParser.urlencoded({ extended: true }));
	serverSettings.use(cookieParser());

	__loadRoutes__(project, serverSettings);
	
	/* Defining static routes */
	__loadStaticRoutes__(project, serverSettings);
	
	debug('Setting up error handling for page not found');
	// catch 404 and forward to error handler
	serverSettings.use(function(req, res, next) {
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		var err = new Error('Not Found:'+fullUrl);
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (serverSettings.get('env') === 'development') {
		debug('Since this is for development. Enabling setup ' + 
			'for display error message to user');
		serverSettings.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
			  message: err.message,
			  error: err
			});
			logger.debug(err);
		});
	}

	// production error handler
	// no stacktraces leaked to user
	serverSettings.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	  logger.debug(err);
	});

};

/**
 * This sets up the view engine
 * @param project the project setting object
 * @param serverSettings the server running this project
 */
function __setView__(project, serverSettings) {
	serverSettings.set('views', project.gulp.tmpFrontEndViewsFolder);
	serverSettings.set('view engine', 'html');
	handlebars.registerPartials(project.gulp.tmpFrontEndViewsPartialsFolder);
	serverSettings.engine('html', handlebars.__express);
}

/**
 * This sets up the static routes
 * @param project the project setting object
 * @param serverSettings the server running this project
 */
function __loadStaticRoutes__(project, serverSettings){
	debug('Loading static routes');
	serverSettings.use('/static/js', 
			express.static(project.gulp.tmpJavascriptFolder));
	
	serverSettings.use('/static/stylesheets',
			express.static(project.gulp.tmpStyleSheetFolder));
	
	serverSettings.use('/static/vendor',
			express.static(project.gulp.tmpVendorFolder));
}

/**
 * This loads automatically all the routes
 * by looping through routes folder
 * @param project the project setting object
 * @param serverSettings the server running this project
 */
function __loadRoutes__(project, serverSettings) {
	debug('Loading Routes');
	var routesFolder = path.join(project.ROOT_FOLDER, 'server', 'routes');
	var routeFiles = wrench.readdirSyncRecursive(routesFolder);
	_.each(routeFiles, function(file){
		debug('Loading route using file = ' + path.join(routesFolder, file));
		var ext = path.extname(file).substring(1);
		if (ext === 'js') {
			var routeDefinition = common.require(path.join(routesFolder, file), project);
			serverSettings.use(routeDefinition.base, routeDefinition.router);
			project.routes[routeDefinition.base] = routeDefinition.router;
		} else {
			debug(file + ' is not a .js file');
		}
	});
}

/**
 * This creates a new instance of morgan middleware 
 * to log http access
 */
function __getAccessLogStream__(project){
	fs.existsSync(project.rootLogFolder) || fs.mkdirSync(project.rootLogFolder);
	fs.existsSync(project.logFolder) || fs.mkdirSync(project.logFolder);
	fs.existsSync(project.accessLogFolder) || fs.mkdirSync(project.accessLogFolder);
	var winston 	= require('winston'),
		httpLogger	= new winston.Logger({
			transports:[
				new winston.transports.File({
						filename: path.join(project.accessLogFolder, 'access.log'),
						maxsize: 10000000,
						maxFiles: 25,
						json: false,
						level: 'info',
						json: false,
						handleExceptions: true,
	    				humanReadableUnhandledException: true

				})
			],
			levels: project.customLogLevels
		});
	
	if(project.env === 'production') {	
		httpLogger.exitOnError = false;
	}

	return {
		write: function(str){
			console.log(str);
			httpLogger.info(str);
		}
	}
}
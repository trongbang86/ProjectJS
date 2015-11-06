var express 			= require('express');
var path 			= require('path');
var favicon 			= require('serve-favicon');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');

var serverSettings = express();

/** This is the heart of all project-related settings
 *	the global.Project is passed into bootstrap.js to
 *	avoid loading the Project setting object again.
 *	This hserverSettingsens when using gulp run
 */
var ProjectModule = require('./config/bootstrap.js'),
    Project 	= ProjectModule(serverSettings);

// view engine setup
serverSettings.set('views', Project.gulp.tmpFrontEndViewsFolder);
serverSettings.set('view engine', 'html');
serverSettings.engine('html', require('hbs').__express);

// uncomment after placing your favicon in /public
//serverSettings.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
serverSettings.use(logger('dev'));
serverSettings.use(bodyParser.json());
serverSettings.use(bodyParser.urlencoded({ extended: false }));
serverSettings.use(cookieParser());

serverSettings.use(require('connect-livereload'));

// catch 404 and forward to error handler
serverSettings.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (serverSettings.get('env') === 'development') {
  serverSettings.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
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
});

/* Defining hooks when server is shutdown */
// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', function(){
  ProjectModule.Projects.shutdown(process.exit);
});

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', function(){
  ProjectModule.Projects.shutdown(process.exit);
}); 

module.exports = {
  serverSettings: serverSettings,
  Project: Project
};

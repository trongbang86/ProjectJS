var gulp 			= require('gulp'),
	fs				= require('fs');
global._				= require('underscore');

/**
 * This is to load project settings
 */
global.Project = require('../../config/bootstrap.js')();

/**
 * Loading tasks based on the current environment
 */
var defaultTasks = require('./default.js');
var envSpecTasks = {},
	envSpecTasksFile = __dirname + '/' + Project.env + '.js';

if(fs.existsSync(envSpecTasksFile)){
	envSpecTasks = require(envSpecTasksFile);
}
var tasks = _.extend({}, defaultTasks, envSpecTasks);

/**
 * Automatically loading all the tasks to gulp
 * ******************TASKS*********************
 * 
 * clean: This cleans out the .tmp folder
 * 
 * stylesheet: This compiles sass files. Depending on which environment it's running,
 * 			it auto-prefixes, concats and
 * 			does all other jobs related to css
 * 			Result is all.css to be used
 * 
 * bowerWiredep: This injects vendor javascripts and css files into layout(s)
 * 			using the bower.json file
 * 
 * appWiredep: This injects project's javascripts and css files into layout(s)
 * 
 * wiredep: this does bowerWiredep and then runs appWiredep
 * 
 * copyBowerFiles: This copies all bower enabled dependencies to temporary folder
 * 
 * copyFrontEndViewsFiles: This copies all views files into tmp folder
 * 
 * javascript: This pre-processes all javascript files
 * 
 * server: This runs the express server
 * 
 * run: This does all the pre-processing for javascripts, layouts, etc.
 * 			and then runs the server
 *
 * watch: This sets up watch for frontend changes
 * 
 * injectNewJavascript: This runs the javascript task and then
 * 			wiredep into the layout
 * 
 * injectNewStyleSheets: This runs the stylesheet task and then
 * 			wiredep into the layout
 */
_.each(tasks, function(func, name){
	gulp.task(name, func);
});

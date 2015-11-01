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
 * style: This compiles sass files. Depending on which environment it's running,
 * 			it auto-prefixes, concats and
 * 			does all other jobs related to css
 * 			Result is all.css to be used
 * 
 * bowerWiredep: This injects vendor javascripts and css files into layout(s)
 * 			using the bower.json file
 * 
 * copyBowerFiles: This copies all bower enabled dependencies to temporary folder
 * 
 * copyFrontEndViewsFiles: This copies all views files into tmp folder
 * 
 * appWiredep: This injects project's javascripts and css files into layout(s)
 * 
 * copyRawJavascriptFiles: This copies all javascript files into tmp folder
 */
_.each(tasks, function(func, name){
	gulp.task(name, func);
});

var gulp 			= require('gulp'),
	fs				= require('fs');

/**
 * This is to load project settings
 */
require('../../app.js');

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
This cleans out the .tmp folder
*/
gulp.task('clean', tasks.clean);

/**
This compiles sass files. Then it auto-prefixes, concats and
does all other jobs related to css
Result is all.css to be used
*/
gulp.task('style', ['clean'], tasks.style);

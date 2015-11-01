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
This cleans out the .tmp folder
*/
gulp.task('clean', tasks.clean);

/**
This compiles sass files. Depending on which environment it's running,
it auto-prefixes, concats and
does all other jobs related to css
Result is all.css to be used
*/
gulp.task('style', tasks.style);

/**
 * This injects vendor javascripts and css files into layout(s)
 * using the bower.json file
 */
gulp.task('bowerWiredep', tasks.bowerWiredep);


/**
 * This copies all bower enabled dependencies to temporary folder
 */
gulp.task('copyBowerFiles', tasks.copyBowerFiles);

/**
 *
 */
gulp.task('copyFrontEndViewsFiles', tasks.copyFrontEndViewsFiles);
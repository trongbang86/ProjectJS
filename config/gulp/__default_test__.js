var gulp 		= require('gulp'),
	mocha		= require('gulp-mocha'),
	Project		= null,
	__tasks__	= {};

module.exports = function(__Project__){
	Project = __Project__;
	return __tasks__;
}

/**
 * This runs all the mocha tests
 */
__tasks__.test = function(){

	return gulp.src([Project.gulp.testServerFolder + '/bootstrap.js',
						Project.gulp.testServerFolder + '/**/*.js']).
				pipe(mocha({
					reporter: 'spec'
				}));
}
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

	/* We have to set the NODE_ENV here because
	 * the bootstrap process takes place only once
	 * and gulp is called first
	 * so the env property is set to 
	 * 'development' instead of 'test'
	 */
	process.env.NODE_ENV = 'test';

	return gulp.src([Project.gulp.testServerFolder + '/bootstrap.js',
						Project.gulp.testServerFolder + '/**/*.js']).
				pipe(mocha({
					reporter: 'spec'
				}));
}
var gulp 		= require('gulp'),
	mocha		= require('gulp-mocha'),
	runSequence = require('run-sequence'),
	Project		= null,
	__tasks__	= {};

var Projects = null;

module.exports = function(__Project__){
	Project = __Project__;
	Projects= require(Project.ROOT_FOLDER + '/config/bootstrap.js').Projects;

	return __tasks__;
}

/**
 * This runs all the mocha tests
 */
__tasks__.test = function(done){
	return runSequence('testServer', 'testOthers', function(){
		Projects.shutdown(function(){
			done();
		})
	});
};

/**
 * This runs the test/test-server folder
 */
__tasks__.testServer = function(){

	return gulp.src([Project.gulp.testServerFolder + '/bootstrap.js',
						Project.gulp.testServerFolder + '/**/*.js']).
				pipe(mocha({
					reporter: 'spec'
				}));
};

/**
 * This runs the test/test-others folder
 */
__tasks__.testOthers = function(){
	return gulp.src(Project.gulp.testOthersFolder + '/**/*.js').
				pipe(mocha({
					reporter: 'spec'
				}));
};
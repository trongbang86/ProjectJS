var del 					= require('del'),
	sass					= require('gulp-ruby-sass'),
	autoprefixer			= require('gulp-autoprefixer'),
	gulp 					= require('gulp'),
	wiredep					= require('wiredep').stream,
	path					= require('path'),
	mainBowerFiles			= require('main-bower-files'),
	runSequence				= require('run-sequence'),
	livereload				= require('gulp-livereload'),
	spawn					= require('child_process').spawn,
	__lrServerPort__		= 35729,
	Project 				= null,
	__tmpLayoutFiles__		= null,
	__frontEndLayoutFiles__	= null,
	__tasks__				= {},
	server 					= null;


module.exports = function(__Project__){
	Project = __Project__;
	/* This prefixes all the layout files with the absolute 
	 * path in the .tmp folder 
	 * and in the frontend folder
	 */
	__tmpLayoutFiles__ = _.map(Project.gulp.layoutFiles, function(file) {
		return path.join(Project.gulp.tmpFrontEndViewsFolder, file);
	});	

	__frontEndLayoutFiles__ = _.map(Project.gulp.layoutFiles, function(file){
		return path.join(Project.gulp.frontEndViewsFolder, file);
	});

	return __tasks__;
}


/**
 * GULP TASKS
 */

/* @Inherit */
__tasks__.clean = function(cb){
	return del([Project.gulp.tmpFolder], cb);
};


/* @Inherit */
__tasks__.copyBowerFiles = function() {
	return gulp.src(mainBowerFiles(), 
					{base: path.join(Project.ROOT_FOLDER, 
							'bower_components')})
			.pipe(gulp.dest(Project.gulp.tmpVendorFolder));
};

/* @Inherit */
__tasks__.copyFrontEndViewsFiles = function() {
	return gulp.src(Project.gulp.frontEndViewsFolder+'/**/*').
			pipe(gulp.dest(Project.gulp.tmpFrontEndViewsFolder));
};

/* @Inherit */
__tasks__.server = function(){
	/* If server exists, kill it before spawn a new one */
	!server || server.kill();

	server = spawn('node', ['bin/www'], {stdio: 'inherit'});

};

var del 					= require('del'),
	gulp 					= require('gulp'),
	path					= require('path'),
	mainBowerFiles			= require('main-bower-files'),
	spawn					= require('child_process').spawn,
    __argv__                = require('yargs').argv,
	Project 				= null,
	__tasks__				= {},
	server 					= null;


module.exports = function(__Project__){
	Project = __Project__;

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
__tasks__.copyFrontEndNonLayoutFiles = function() {
	return gulp.src(Project.gulp.frontEndNonLayoutFiles).
			pipe(gulp.dest(Project.gulp.tmpFrontEndViewsFolder));
};

/* @Inherit */
__tasks__.server = function(){
	/* If server exists, kill it before spawn a new one */
	!server || server.kill();
    var args = [];
    if (__argv__['debug']) args.push('debug');
    args.push('bin/www');
	server = spawn('node', args, {stdio: 'inherit'});

};

var	autoprefixer		= require('gulp-autoprefixer'),
	sass				= require('gulp-ruby-sass'),
	minifycss			= require('gulp-minify-css'),
	uglifyJs			= require('gulp-uglify'),
	concat				= require('gulp-concat'),
	usemin 				= require('gulp-usemin'),
	gulp 				= require('gulp'),
	_ 					= require('underscore'),
	wiredep				= require('wiredep').stream,
	path				= require('path'),
	runSequence 		= require('run-sequence'),
	rename				= require('gulp-rename'),
	Project				= null,
	__tmpLayoutFiles__	= null;
	__tasks__			= {};

module.exports = function(__Project__){
	Project = __Project__;

	__tmpLayoutFiles__ = _.map(Project.gulp.layoutFiles, function(file) {
		return path.join(Project.gulp.tmpFrontEndViewsFolder, file);
	});	

	return __tasks__;
}

/* @Inherit */
__tasks__.stylesheet = function(done){
	return runSequence(['vendorStyleSheet', 'projectStyleSheet'], done);
};

/* @Inherit */
__tasks__.javascript = function(done){
	return runSequence(['vendorJavaScript', 'projectJavaScript'], done);
};

/**
 * This is to be used by task javascript
 * It does pre-processing for vendor javascript files
 */
__tasks__.vendorJavaScript = function(){
	return gulp.src(Project.gulp.tmpVendorJavascript).
			pipe(uglifyJs()).
			pipe(rename('vendor.js')).
			pipe(gulp.dest(Project.gulp.tmpJavascriptFolder));
};

/**
 * This is to be used by task javascript
 * It does pre-processing for project javascript files
 */
__tasks__.projectJavaScript = function(){
	return gulp.src(Project.gulp.frontEndJavascript).
			pipe(uglifyJs()).
			pipe(rename('project.js')).
			pipe(gulp.dest(Project.gulp.tmpJavascriptFolder));
};

/**
 * This is a common method for all wiredep tasks
 * @param wiredepOptions wiredep options
 * @returns gulp's stream
 */
function wiredepFunc(wiredepOptions) {
	var layoutFiles = __tmpLayoutFiles__;
	
	return gulp.src(layoutFiles).
				pipe(wiredep(wiredepOptions)).
				pipe(gulp.dest(Project.gulp.tmpFrontEndViewsFolder));
}

/* @Inherit */
__tasks__.prepare = function(done){
	return runSequence('clean', 
						['copyBowerFiles', 'copyFrontEndViewsFiles'],
						['stylesheet', 'javascript'],
						'wiredep',
						'productionBuild',
						done);
};


/* @Inherit */
__tasks__.wiredep = function() {

	/* Wiredep settings for injecting project's dependencies */
	var productionWiredepOptions 	= {
			bowerJson: {
				name: 'ProjectJS',
				main: [
					'.tmp/frontend/stylesheets/vendor.css',
					'.tmp/frontend/stylesheets/project.css',
					'.tmp/frontend/js/vendor.js',
					'.tmp/frontend/js/project.js'
				]
			},
			includeSelf: true,
			fileTypes: {
				html: {
					block: /(([ \t]*)<!--\s*app_bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi
				}
			}
	};

	return wiredepFunc(productionWiredepOptions);
};

/**
 * This is to be called by task stylesheet.
 * It builds the final files: all.css and all.js to be
 * referenced in the layout file(s)
 */
__tasks__.productionBuild = function(){
	return gulp.src(__tmpLayoutFiles__).
			pipe(usemin({
				css: [concat('../stylesheets/all.css')],
				js: [rename('../js/all.js')]
			})).
			pipe(gulp.dest(Project.gulp.tmpFrontEndViewsFolder));
};

/**
 * This is to be called by task stylesheet.
 * It does pre-processing for vendor stylesheet files.
 */
__tasks__.vendorStyleSheet = function(){
	return gulp.src(Project.gulp.tmpVendorStyleSheets).
		pipe(concat('vendor.css')).
		pipe(minifycss()).
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
};

/**
 * This is to be called by task stylesheet
 * It does pre-processing for the project's stylesheet files
 */
__tasks__.projectStyleSheet = function() {
	return sass(Project.gulp.frontEndStyleSheets).
		pipe(autoprefixer('last 2 versions')).
		pipe(concat('project.css')).
		pipe(minifycss()).
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
};
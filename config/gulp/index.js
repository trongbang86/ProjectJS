var gulp 			= require('gulp'),
	autoprefixer		= require('gulp-autoprefixer'),
	sass				= require('gulp-ruby-sass'),
	minifycss		= require('gulp-minify-css'),
	uglifyjs			= require('gulp-uglify'),
	concat			= require('gulp-concat'),
	del				= require('del'),
	gulpUtil			= require('gulp-util');

/**
 * This is to load project settings
 */
require('../../app.js');

/**
This cleans out the .tmp folder
*/
gulp.task('clean', function(cb){
	return del(['.tmp'], cb);
});

/**
This compiles sass files. Then it auto-prefixes, concats and
does all other jobs related to css
Result is all.css to be used
*/
gulp.task('style', ['clean'], function(){
	return sass(Project.gulp.frontEndStyleSheets).
		pipe(autoprefixer('last 2 versions')).
		pipe(concat('all.css')).
		pipe(minifycss()).
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
});

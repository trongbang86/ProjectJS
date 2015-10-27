var gulp 			= require('gulp'),
	autoprefixer		= require('gulp-autoprefixer'),
	sass				= require('gulp-ruby-sass'),
	minifycss		= require('gulp-minify-css'),
	uglify			= require('gulp-uglify'),
	concat			= require('gulp-concat'),
	del				= require('del'),
	gulpUtil			= require('gulp-util');

gulp.task('clean', function(cb){
	return del(['.tmp'], cb);
});

gulp.task('style', ['clean'], function(){
	return sass('frontend/stylesheets/**.sass').
		pipe(autoprefixer('last 2 versions')).
		pipe(concat('all.css')).
		pipe(uglify().on('error', gulpUtil.log)).
		pipe(gulp.dest('.tmp/frontend/stylesheets/'));
});

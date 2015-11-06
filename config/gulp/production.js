var	autoprefixer	= require('gulp-autoprefixer'),
	sass			= require('gulp-ruby-sass'),
	minifycss		= require('gulp-minify-css'),
	concat			= require('gulp-concat'),
	gulp 			= require('gulp'),
	Project			= null,
	__tasks__		= {};

module.exports = function(__Project__){
	Project = __Project__;
	return __tasks__;
}

__tasks__.stylesheet = function(){
	return sass(Project.gulp.frontEndStyleSheets).
		pipe(autoprefixer('last 2 versions')).
		pipe(concat('all.css')).
		pipe(minifycss()).
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
};
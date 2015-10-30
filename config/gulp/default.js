var del 			= require('del'),
	sass			= require('gulp-ruby-sass'),
	autoprefixer	= require('gulp-autoprefixer'),
	gulp 			= require('gulp'),
	wiredep			= require('wiredep').stream,
	path			= require('path'),
	mainBowerFiles	= require('main-bower-files');

/* @Inherit */
module.exports.clean = function(cb){
	return del([Project.gulp.tmpFolder], cb);
};

/* @Inherit */
module.exports.style = function() {
	return sass(Project.gulp.frontEndStyleSheets).
		pipe(autoprefixer('last 2 versions')).
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
}

/* @Inherit */
module.exports.bowerWiredep = function() {
	var layoutFile = path.join(Project.ROOT_FOLDER, 
								Project.gulp.frontEndViewsFolder,
								'layout.html');
	return gulp.src([layoutFile]).
				pipe(wiredep({
					ignorePath: /(\.\.\/){2}bower_components\//,

					fileTypes: {
						html: {
							block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
							detect: {
								js: /<script.*src=['"]([^'"]+)/gi,
								css: /<link.*href=['"]([^'"]+)/gi
							},
							replace: {
								js: '<script src="/static/javascript/{{filePath}}"></script>',
								css: '<link rel="stylesheet" href="/static/stylesheets/{{filePath}}" />'
							}
						}
					}
				})).
				pipe(gulp.dest(path.join(Project.ROOT_FOLDER, 
								Project.gulp.frontEndViewsFolder)));
}

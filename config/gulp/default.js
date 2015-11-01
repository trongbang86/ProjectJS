var del 					= require('del'),
	sass					= require('gulp-ruby-sass'),
	autoprefixer			= require('gulp-autoprefixer'),
	gulp 				= require('gulp'),
	wiredep				= require('wiredep').stream,
	path					= require('path'),
	mainBowerFiles		= require('main-bower-files'),
	runSequence			= require('run-sequence');

/* Wiredep settings for injecting bower enabled dependencies */
var bowerWiredepOptions 	= {
		ignorePath: /(\.\.\/)*bower_components\//,

		fileTypes: {
			html: {
				block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
				detect: {
					js: /<script.*src=['"]([^'"]+)/gi,
					css: /<link.*href=['"]([^'"]+)/gi
				},
				replace: {
					js: '<script src="/static/vendor/{{filePath}}"></script>',
					css: '<link rel="stylesheet" href="/static/vendor/{{filePath}}" />'
				}
			}
		}
};
/* Wiredep settings for injecting project's dependencies */
var appWiredepOptions 	= {
		bowerJson: require('../app_bower.json'),
		ignorePath: /(\.\.\/)*(stylesheets|js)\//,
		includeSelf: true,
		fileTypes: {
			html: {
				block: /(([ \t]*)<!--\s*app_bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
				replace: {
					js: '<script src="/static/js/{{filePath}}"></script>',
					css: '<link rel="stylesheet" href="/static/stylesheets/{{filePath}}" />'
				}
			}
		}
};

/* @Inherit */
module.exports.clean = function(cb){
	return del([Project.gulp.tmpFolder], cb);
};

/* @Inherit */
module.exports.stylesheet = function() {
	return sass(Project.gulp.frontEndStyleSheets).
		pipe(autoprefixer('last 2 versions')).
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
};

/**
 * This is a common method for all wiredep tasks
 * @param wiredepOptions wiredep options
 * @returns gulp's stream
 */
function wiredepFunc(wiredepOptions) {
	var layoutFiles = _.map(Project.gulp.layoutFiles, function(file) {
		return path.join(Project.gulp.tmpFrontEndViewsFolder, file);
	});
	
	return gulp.src(layoutFiles).
				pipe(wiredep(wiredepOptions)).
				pipe(gulp.dest(Project.gulp.tmpFrontEndViewsFolder));
}

/* @Inherit */
module.exports.bowerWiredep = function() {
	return wiredepFunc(bowerWiredepOptions);
};

/* @Inherit */
module.exports.copyBowerFiles = function() {
	return gulp.src(mainBowerFiles(), 
					{base: path.join(Project.ROOT_FOLDER, 
							'bower_components')})
			.pipe(gulp.dest(Project.gulp.tmpVendorFolder));
};

/* @Inherit */
module.exports.copyFrontEndViewsFiles = function() {
	return gulp.src(Project.gulp.frontEndViewsFolder+'/**/*').
			pipe(gulp.dest(Project.gulp.tmpFrontEndViewsFolder));
};

/* @Inherit */
module.exports.appWiredep = function() {
	return wiredepFunc(appWiredepOptions);
};

/* @Inherit */
module.exports.javascript = function(){
	return gulp.src(Project.gulp.frontEndJavascript).
			pipe(gulp.dest(Project.gulp.tmpJavascriptFolder));
}

/* @Inherit */
module.exports.server = function(){
	require('../../bin/www');
};

/* @Inherit */
module.exports.wiredep = function(done) {
	return runSequence('bowerWiredep', 'appWiredep', done);
}

/* @Inherit */
module.exports.run = function(done){
	return runSequence('clean', 
						['copyBowerFiles', 'copyFrontEndViewsFiles'],
						['stylesheet', 'javascript'],
						'wiredep',
						'server',
						done);
};
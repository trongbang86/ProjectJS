var del 					= require('del'),
	sass					= require('gulp-ruby-sass'),
	autoprefixer			= require('gulp-autoprefixer'),
	gulp 					= require('gulp'),
	wiredep					= require('wiredep').stream,
	path					= require('path'),
	mainBowerFiles			= require('main-bower-files'),
	runSequence				= require('run-sequence'),
	livereload				= require('gulp-livereload'),
	debug					= require('debug')('ProjectJS'),
	__lrServerPort__		= 35729,
	Project 				= null,
	__tmpLayoutFiles__		= null,
	__tasks__				= {};

module.exports = function(__Project__){
	Project = __Project__;

	__tmpLayoutFiles__ = _.map(Project.gulp.layoutFiles, function(file) {
		return path.join(Project.gulp.tmpFrontEndViewsFolder, file);
	});	

	return __tasks__;
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
__tasks__.bowerWiredep = function() {
	return wiredepFunc(bowerWiredepOptions);
};

/* @Inherit */
__tasks__.wiredep = function(done) {
	return runSequence('bowerWiredep', 'appWiredep', done);
}

/* @Inherit */
__tasks__.appWiredep = function() {
	return wiredepFunc(appWiredepOptions);
};


/* @Inherit */
__tasks__.injectNewJavascript = function(done){
	return runSequence('javascript', 'wiredep', done);
};

/* @Inherit */
__tasks__.injectNewStyleSheets = function(done){
	return runSequence('stylesheet', 'wiredep', done);
};

/* @Inherit */
__tasks__.compileFrontEnd = function(done) {
	return runSequence('clean', 
						['copyBowerFiles', 'copyFrontEndViewsFiles'],
						['stylesheet', 'javascript'],
						'wiredep',
						done);
}

/* @Inherit */
__tasks__.run = function(done){
	return runSequence('compileFrontEnd',
						['server', 'watch'],
						done);
};

/* @Inherit */
__tasks__.stylesheet = function() {
	if (Project.noSass) {
		debug('Preparing stylesheet files without SASS');

		return gulp.src(Project.gulp.frontEndStyleSheets).
			pipe(autoprefixer('last 2 versions')).
			pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder)).
			pipe(livereload({port: __lrServerPort__}));	

	} else {
		debug('Preparing stylesheet files with SASS');
		return sass(Project.gulp.frontEndStyleSheets).
			pipe(autoprefixer('last 2 versions')).
			pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder)).
			pipe(livereload({port: __lrServerPort__}));	
	}
};

/* @Inherit */
__tasks__.watch = function() {
	livereload.listen({port: __lrServerPort__});

	gulp.watch(Project.gulp.frontEndJavascript, ['injectNewJavascript']);
	gulp.watch(Project.gulp.frontEndStyleSheets, ['injectNewStyleSheets']);
	gulp.watch(Project.gulp.frontEndNonLayoutFiles, ['copyFrontEndNonLayoutFiles']);
	gulp.watch(Project.ROOT_FOLDER+'/server/**/*.js', ['server'])
	gulp.watch(Project.gulp.frontEndLayoutFiles, ['compileFrontEnd']);
};

/* @Inherit */
__tasks__.javascript = function(){
	return gulp.src(Project.gulp.frontEndJavascript).
			pipe(gulp.dest(Project.gulp.tmpJavascriptFolder)).
			pipe(livereload({port: __lrServerPort__}));
};

var gulp 		= require('gulp'),
	mocha		= require('gulp-mocha'),
	runSequence = require('run-sequence'),
	protractor	= require('gulp-protractor').protractor,
	spawn		= require('child_process').spawn,
	path 		= require('path'),
	Promise		= require('bluebird'),
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
    __init__();
	return runSequence('testServer', 'testOthers', 
				'testE2e', function(){
					Projects.shutdown(function(){
						done();
				})
	});
};

/* @Inherit */
__tasks__.testServerOnce = function(){
    __init__();

	return gulp.src([Project.gulp.testServerFolder + '/bootstrap.js',
						Project.gulp.testServerFolder + '/**/*.js'])
				.pipe(mocha({
					reporter: 'spec'
				}))
				.once('error', function() {
		            Project.shutdown();
		        })
		        .once('end', function() {
		            Project.shutdown();
		        });
};

/* @Inherit */
__tasks__.testServer = function() {
    __init__();
	gulp.watch(Project.gulp.watchTestServerFiles, function(){
		gulp.src([Project.gulp.testServerFolder + '/bootstrap.js',
						Project.gulp.testServerFolder + '/**/*.js'])
			.pipe(mocha({
				reporter: 'spec'
			}));
	});
}

/* @Inherit */
__tasks__.testOthersOnce = function(){
    __init__();
	return gulp.src(Project.gulp.testOthersFolder + '/**/*.js')
				.pipe(mocha({
					reporter: 'spec'
				}))
				.once('error', function() {
		            Project.shutdown();
		        })
		        .once('end', function() {
		            Project.shutdown();
		        });
};

/* @Inherit */
__tasks__.testOthers = function(done) {
    __init__();
	gulp.watch(Project.gulp.watchTestOthersFiles, function(){
		gulp.src(Project.gulp.testOthersFolder + '/**/*.js')
			.pipe(mocha({
				reporter: 'spec'
			}))
			.once('error', function(error) {
	            console.log('Finished test suits with errors');
	        })
	        .once('end', function() {
	        	console.log('Finished running tests');
	        });
	})
}

/*
 * This gets the path to protractor folder under node_modules
 */
function getProtractorBinary(binaryName){
    var pkgPath = require.resolve('protractor');
    var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
    return path.join(protractorDir, '/'+binaryName);
}

/* @Inherit */
__tasks__.testE2e = function(done){
    __init__();
	return runSequence('server', 'testProtractor', done);
};

/* @Inherit */
__tasks__.testProtractor = function(done){
    __init__();

	return new Promise(function(resolve, reject){
		/**
		 * Steps:
		 * 1. webdriver-manager update: to make sure the standalone 
		 *			selenium driver is downloaded to be used
		 * 2. webdriver-manager start: to start selenium driver
		 * 3. run protractor test cases
		 */
		var webdriverBinary = getProtractorBinary('webdriver-manager');

		spawn('node', [webdriverBinary, 'update'], {stdio: 'inherit'})
			.once('close', function(){
				var webdriverProcess = spawn('node', 
												[webdriverBinary, 'start'], 
												{stdio: 'inherit'});

				webdriverProcess.once('end', function(){
					done();
				})

				webdriverProcess.on('error', function(){
					webdriverProcess.kill();
					done();
				})

				setTimeout(function(){
					var stream = gulp.src(Project.gulp.testE2eFolder + '/**/*.spec.js').
									pipe(protractor({
										configFile: Project.gulp.testE2eFolder + 
														'/protractor.conf.js'
									})).on('end', function(){
										webdriverProcess.kill();
									});
					resolve(stream);
				}, 5000);
			});
	});

	

};

/**
 * This sets up everything before running tests
 */
function __init__() {
    if (process.env.NODE_ENV === undefined 
            || process.env.NODE_ENV === '') {
        process.env.NODE_ENV='test';
    }
}

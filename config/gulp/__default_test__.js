var gulp 		= require('gulp'),
	mocha		= require('gulp-mocha'),
	runSequence = require('run-sequence'),
	protractor	= require('gulp-protractor').protractor,
	spawn		= require('child_process').spawn,
	__argv__ 	= require('yargs').argv,
    gulpif      = require('gulp-if'),
	path 		= require('path'),
    istanbul    = require('gulp-istanbul'),
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

/**
 * return a common stream for running
 * test-server with coverage
 */

function __testServer__() {
    var sourceCollect = ['./server/**/*.js'],
        testCollect =   [Project.gulp.testServerFolder + '/bootstrap.js',
                                Project.gulp.testServerFolder + '/**/*.js'],
        coverageFolder = './coverage/test-server';
    return __test__(sourceCollect, testCollect, coverageFolder);

}

/**
 * return a common stream for running
 * test-integration with coverage
 */
function __testIntegration__() {
    var sourceCollect = ['./server/**/*.js'],
        testCollect =   [Project.gulp.testIntegrationFolder + '/bootstrap.js',
                                Project.gulp.testIntegrationFolder + '/**/*.js'],
        coverageFolder = './coverage/test-integration';
    return __test__(sourceCollect, testCollect, coverageFolder);
}

/**
 * return a common stream for running
 * test-* with coverage
 */
function __test__(sourceCollect, testCollect, coverageFolder) {
    var debugFlag = __argv__['debug'];
    var timeout = 2000;
    
    if(debugFlag){
        timeout = 999999;
    }
	return gulp.src(sourceCollect)
                .pipe(gulpif(!debugFlag, istanbul({includeUntested: true})))
                .pipe(gulpif(!debugFlag, istanbul.hookRequire()))
                .on('finish', function() {
                    gulp.src(testCollect)
                        .pipe(mocha({
                            reporter: 'spec',
                            timeout: timeout
                        }))
                        .pipe(gulpif (!debugFlag, istanbul.writeReports({
                            dir: coverageFolder,
                            reporters: [ 'html' ],
                            reportOpts: { dir: coverageFolder}
                        })))
                        .once('error', function() {
                            Project.shutdown();
                        })
                        .once('end', function() {
                            Project.shutdown();
                        });
        
                })
                .once('error', function() {
                    Project.shutdown();
                })
                .once('end', function() {
                    Project.shutdown();
                });

}

/* @Inherit */
__tasks__.testIntegrationOnce = function(){
    __init__();
    return __testIntegration__();
};

/* @Inherit */
__tasks__.testIntegration = function() {
    __init__();
    __testIntegration__();
	gulp.watch(Project.gulp.watchTestIntegrationFiles, function(){
        __testIntegration__();
	});
}

/* @Inherit */
__tasks__.testServerOnce = function(){
    __init__();
    return __testServer__();
};

/* @Inherit */
__tasks__.testServer = function() {
    __init__();
    __testServer__();
	gulp.watch(Project.gulp.watchTestServerFiles, function(){
        __testServer__();
	});
}

/**
 * a common method for testing test-others
 */
function __testOthers__() {
    var sourceCollect = ['./config/**/*.js'],
        testCollect =   [Project.gulp.testOthersFolder + '/bootstrap.js',
                                Project.gulp.testOthersFolder + '/**/*.js'],
        coverageFolder = './coverage/test-others';
    return __test__(sourceCollect, testCollect, coverageFolder);

}


/* @Inherit */
__tasks__.testOthersOnce = function(){
    __init__();
	return __testOthers__();
};

/* @Inherit */
__tasks__.testOthers = function(done) {
    __init__();
    __testOthers__();
	gulp.watch(Project.gulp.watchTestOthersFiles, function(){
        __testOthers__();
	});
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

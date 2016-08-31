exports.config = {
	framework: 'mocha',

    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:3000',

    multiCapabilities: [{
        browserName: 'chrome'
    }],
    
    mochaOpts: {
    	enableTimeouts: false
    }, 

    onPrepare: function(){
    	global.expect = require('chai').expect;
    	global.helper = require('./helper.js');
        global._ = require('lodash');
    }
}
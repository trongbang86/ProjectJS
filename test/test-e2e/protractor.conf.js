exports.config = {
	framework: 'mocha',

    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:3000',

    multiCapabilities: [{
        'browserName': 'firefox'
    }, , {
       'browserName': 'chrome',
       'version': '1',
       'chromeOptions' : {
           args: ['--lang=en',
                  '--window-size=1100,1100']
       }

    },{
       'browserName': 'chrome',
       'version': '2',
       'chromeOptions' : {
            args: ['--lang=en',
                   '--window-size=350,650']
       }

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
var debug = require('debug')('ProjectJS');

/**
 * This is to share common functions
 */
module.exports = function() {
	return {
		require: __require__
	}
};


/**
 * This function helps loading a javascript file with arguments
 * If the javascript file doesn't follow the standard
 * module.exports = function() {}
 * It will throw an error to stop the configuration process
 */
function __require__(file, args) {
	debug('Using common.require() method with file=' + file +
		'; args type = ' + args.constructor.name);

	try {
		if (args.constructor.name === 'Array') {
			if (args.length > 3) {
				throw new Error('__require__(file, args) only supports' +
					' maximum args of 3 values');
			}
			return require(file)(args[0], args[1], args[2]);
		} else {
			return require(file)(args);
		}
	} catch (e) {
		if (e.constructor.name === 'TypeError' &&
			e.message === 'require(...) is not a function') {
				throw new Error(file + ' must use the syntax' +
					' module.exports = function(){}');
		} else {
			debug('Caught an exception when require file['+ 
				file + ']. Rethrowing!!!');
			
			throw e;
		}
	}
}
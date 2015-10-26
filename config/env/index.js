/*
This loads settings from corresponding configuration json-based file
@return: [nconf]
*/
module.exports = function(){
	var env = process.env.NODE_ENV || 'development';
	var nconf = require('nconf');
	var path = require('path');
	nconf.argv().env()
		.file({file: path.join(__dirname, env + ".json")});

	return nconf;		
}
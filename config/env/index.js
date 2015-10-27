/*
This loads settings from corresponding configuration json-based file
@this: Project object - settings
@return: [nconf]
*/
module.exports = function(){
	var env = this.env;
	var nconf = require('nconf');
	var path = require('path');
	nconf.argv().env()
		.file({file: path.join(__dirname, env + ".json")});

	return nconf;		
}
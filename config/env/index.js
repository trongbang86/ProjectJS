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
		.file(env, path.join(__dirname, env + ".json"))
		.file('default', path.join(__dirname, "default.json"));

	return nconf;		
}
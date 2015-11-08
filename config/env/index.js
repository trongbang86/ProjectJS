/*
 * This loads settings from corresponding configuration json-based file
 * @this: any {} which must have the attribute env.
 * 		For Example:
 * 			- Project object - settings
 * @return: [nconf]
*/
module.exports = function(){
	var env = this.env;
	var nconf = require('nconf');

	/**
	 * We have to remove nconf from require.cache
	 * so that each time we load config/bootstrap.js
	 * we can have a different instance for environment settings
	 */
	delete require.cache[require.resolve('nconf')];

	var path = require('path');
	nconf.argv().env()
		.file("__" + env + "__", path.join(__dirname, "__" + env + "__.json"))
		.file(env, path.join(__dirname, env + ".json"))
		.file('default', path.join(__dirname, "default.json"));
	return nconf;		
}
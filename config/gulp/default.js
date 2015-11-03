/* Importing tasks from other files */
module.exports = _.extend({}, 
	require('./__default_frontend__.js'),
	require('./__default_database__.js'));
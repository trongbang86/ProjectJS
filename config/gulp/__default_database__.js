var gulp 		= require('gulp'),
	shell		= require('gulp-shell'),
	path		= require('path'),
	__argv__ 	= require('yargs').argv;

module.exports.db = function(){
	console.log('Instructions: \n' +
		'gulp db --make migration_name \n' +
		'gulp db --migrate \n' +
		'gulp db --rollback \n' +
		'gulp db --version');

	var knexfile 	= path.join(Project.ROOT_FOLDER, 'config', 'knexfile.js'),
		config 		= require(knexfile)[Project.env],
		knex 		= require('knex')(config);

	if(__argv__['make']) {
		knex.migrate.make(__argv__['make']);
	} else if (__argv__['migrate']) {
		knex.migrate.latest();
	} else if (__argv__['rollback']) {
		knex.migrate.rollback();
	} else if (__argv__['version']) {
		knex.migrate.currentVersion();
	}
};
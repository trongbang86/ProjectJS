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
		knex.migrate.make(__argv__['make']).
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy();
				});

	} else if (__argv__['migrate']) {
		return knex.migrate.latest().
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy();
				});

	} else if (__argv__['rollback']) {
		knex.migrate.rollback().
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy();
				});

	} else if (__argv__['version']) {
		knex.migrate.currentVersion().
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy();
				});
	}
};
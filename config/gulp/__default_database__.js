var gulp 		= require('gulp'),
	path		= require('path'),
	__argv__ 	= require('yargs').argv;

module.exports.db = function(done){
	console.log('Instructions: \n' +
		'gulp db --make migration_name \n' +
		'gulp db --migrate \n' +
		'gulp db --rollback \n' +
		'gulp db --version');
	var knex = Project.Models.__knex__;

	if(__argv__['make']) {
		knex.migrate.make(__argv__['make']).
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy(done);
				});

	} else if (__argv__['migrate']) {
		knex.migrate.latest().
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy(done);
				});

	} else if (__argv__['rollback']) {
		knex.migrate.rollback().
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy(done);
				});

	} else if (__argv__['version']) {
		knex.migrate.currentVersion().
				then(function(version){
					console.log('The current version is: ' + version);
				}).
				catch(function(error){
					console.log(error);
				}).
				finally(function(){
					knex.destroy(done);
				});
	}
};
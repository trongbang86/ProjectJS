var gulp 		= require('gulp'),
	path		= require('path'),
	__argv__ 	= require('yargs').argv,
	Project		= null,
	__tasks__	= {};
	
module.exports = function(__Project__){
	Project = __Project__;
	return __tasks__;
}

function __displayHelp__() {
	console.log('Instructions: \n' +
		'gulp db --make migration_name \n' +
		'gulp db --migrate \n' +
		'gulp db --rollback \n' +
		'gulp db --version \n' +
		'gulp db --seed seed_name');
}

function __make__(knex, done) {
	knex.migrate.make(__argv__['make']).
		catch(function(error){
			console.log(error);
		}).
		finally(function(){
			knex.destroy(done);
		});
}

function __version__(knex, done) {
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

function __migrate__(knex, done) {
	knex.migrate.latest().
		catch(function(error){
			console.log(error);
		}).
		finally(function(){
			knex.destroy(done);
		});
}

function __rollback__(knex, done) {
	knex.migrate.rollback().
		catch(function(error){
			console.log(error);
		}).
		finally(function(){
			knex.destroy(done);
		});
}

function __seed__(knex, done) {
	knex.seed.make(__argv__['seed'])
		.catch(function(error){
			console.log(error);
		}).finally(function(){
			knex.destroy(done);
		})
}

__tasks__.db = function(done){
	__displayHelp__();

	var knex = Project.Models.__knex__;

	if(__argv__['make']) {
		__make__(knex, done);

	} else if (__argv__['migrate']) {
		__migrate__(knex, done);

	} else if (__argv__['rollback']) {
		__rollback__(knex, done);

	} else if (__argv__['version']) {
		__version__(knex, done);
	} else if (__argv__['seed']){ 
		__seed__(knex, done);
	} else {
		console.log('No valid action has been selected. Exitting!');
		knex.destroy(done);
	}
};
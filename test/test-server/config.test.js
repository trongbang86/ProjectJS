var path 	= require('path'),
	fs 		= require('fs');

describe('Configuration', function(){
	
	it('loads different database connections depending on the environment', function(){
		var testConfigFile 	= null,
			envFolder		= TestProject.ROOT_FOLDER + '/config/env' ;
		var testConfig = {};

		if(fs.existsSync(envFolder + '/test.json')){
			testConfigFile = envFolder + '/test.json';
		}
        _.extend(testConfig, require(testConfigFile));

		if(fs.existsSync(envFolder + '/__test__.json')){
			testConfigFile = envFolder + '/__test__.json';
		}
        _.extend(testConfig, require(testConfigFile));

		expect(TestProject.database.name).to.eq(testConfig.database.name);
	});
	
	it("throws Error if 'default' is used as the environment name", function(){
		expect(function(){
			var denyDefaultEnv = require('../../config/bootstrap.js')
									(null, {project: TestProject})
										.__denyDefaultEnv__;
			expect(denyDefaultEnv).to.exist;
			denyDefaultEnv('default');
			
		}).to.throw(Error);
	});
	
	it('uses default values if the value is not set ' + 
			'in the corresponding environment file', function(){
		var nconfInstance = require(TestProject.ROOT_FOLDER + '/config/env').call(null);
		expect(nconfInstance.get('This_is_for_testing')).to.eq('This_is_for_testing');
	});
	
	it('automatically prefixes ROOT_FOLDER ' +
			'to any gulp setting ending with Folder', function(){
		expect(TestProject.gulp.tmpFolder.startsWith(TestProject.ROOT_FOLDER))
				.to.eq(true);
	});
	
	it('injects Models and __knex__ into Project', function(){
		expect(TestProject.Models).to.exist;
		expect(TestProject.Models.__knex__).to.exist;
	});
	
	it('uses the same Project setting object if '+
			'passed into bootstrap.js', function(){
		var fakeProject = {a:'a'};
		var bootstrapFile = path.join(TestProject.ROOT_FOLDER, 
				'config', 'bootstrap.js');
		
		var project = require(bootstrapFile)(null, {project: fakeProject});
		expect(project).to.eq(fakeProject);
	});
});

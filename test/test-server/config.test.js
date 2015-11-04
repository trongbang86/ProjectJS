describe('Configuration', function(){
	it('creates a global variable called project', function(){
		expect(Project).to.exist;
	});

	it('loads different database connections depending on the environment', function(){
		var testConfig = require('../../config/env/test.json');
		expect(Project.database.name).to.eq(testConfig.database.name);
	});
	
	it("throws Error if 'default' is used as the environment name", function(){
		expect(function(){
			var denyDefaultEnv = require('../../config/bootstrap.js').denyDefaultEnv;
			expect(denyDefaultEnv).to.exist;
			denyDefaultEnv('test');
			
		}).to.throw(Error);
	});
	
	it('uses default values if the value is not set ' + 
			'in the corresponding environment file', function(){
		var nconfInstance = require(Project.ROOT_FOLDER + '/config/env').call(null);
		expect(nconfInstance.get('This_is_for_testing')).to.eq('This_is_for_testing');
	});
	
	it('automatically prefixes ROOT_FOLDER ' +
			'to any gulp setting ending with Folder', function(){
		expect(Project.gulp.tmpFolder.startsWith(Project.ROOT_FOLDER))
				.to.eq(true);
	});
	
	it('injects Models and __knex__ into Project', function(){
		expect(Project.Models).to.exist;
		expect(Project.Models.__knex__).to.exist;
	})
});
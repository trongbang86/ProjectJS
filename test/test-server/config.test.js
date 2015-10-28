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
});
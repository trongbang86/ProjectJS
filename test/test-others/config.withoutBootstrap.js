describe('Config', function(){
	it("doesn't call __applyServerSetup__ if server is null", function(){
		expect(function(){
			require('../../config/bootstrap.js')(null).shutdown();
		}).to.not.throw(Error);
	});
});

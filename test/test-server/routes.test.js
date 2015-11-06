describe('Routes', function(){
	it('loads and assigns routes from ' + 
		'each definition file at their own base url', function(){
		var fs = require('fs');
		var defFiles = fs.readdirSync(TestProject.ROOT_FOLDER + '/server/routes');
		expect(_.size(TestProject.routes)).to.eq(_.size(defFiles));
	});
});
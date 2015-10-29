describe('Routes', function(){
	it('loads and assigns routes from ' + 
		'each definition file at their own base url', function(){
		var fs = require('fs');
		var defFiles = fs.readdirSync(Project.ROOT_FOLDER + '/routes');
		expect(_.size(Project.routes)).to.eq(_.size(defFiles));
	});
});
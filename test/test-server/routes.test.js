describe('Routes', function(){
	it('loads and assigns routes from ' + 
		'each definition file at their own base url', function(){
		var wrench = require('wrench');
		var path = require('path');
		var defFiles = wrench.readdirSyncRecursive(TestProject.ROOT_FOLDER + '/server/routes');
		expect(_.size(TestProject.routes))
			.to.eq(_(defFiles).filter(function(file){
				var ext = path.extname(file);
				return ext === '.js';
			}).length);
	});
});
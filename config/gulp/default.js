var del = require('del');

module.exports.clean = function(cb){
	return del([Project.gulp.tmpFolder], cb);
};
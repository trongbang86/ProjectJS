module.exports = function(Project) {
	return {
		handle: function(res, error) {
			if (error.constructor.name === 'TypeError') {
				console.log(error);
			}
			
			res.send('error:' + error);
		}
	};
}
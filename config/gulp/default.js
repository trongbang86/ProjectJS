/* Importing tasks from other files */
module.exports = function(__Project__){
	return _.extend({}, 
					require('./__default_frontend__.js')(__Project__),
					require('./__default_database__.js')(__Project__),
					require('./__default_test__.js')(__Project__));
}	
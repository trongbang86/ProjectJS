
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('topic', function(table){
			table.increments('id').primary();
			table.string('description');
			table.timestamp('createdAt');
			table.timestamp('updatedAt');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('topic')
	]);
};

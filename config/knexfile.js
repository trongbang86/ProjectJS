/*
Knex configuration file for database migration
Knex is run independently from the project so 
we have to load project settings manually
*/
var Project = require('./bootstrap.js')(null);
var migrationDirectory = Project.ROOT_FOLDER + "/migrations/" + Project.env;

module.exports[Project.env] = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user:     'username',
    password: 'password'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: migrationDirectory
  }
};

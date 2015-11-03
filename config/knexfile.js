/*
Knex configuration file for database migration
Knex is run independently from the project so 
we have to load project settings manually
*/
var path        = require('path'),
    ROOT_FOLDER = path.join(__dirname, '..'),
    ENV         = process.env.NODE_ENV || 'development';

var migrationDirectory  = ROOT_FOLDER + "/migrations/" + ENV,
    settings            = require('./env/' + ENV + '.json').database;

module.exports[ENV] = {
  client: settings.client,
  connection: {
    database: settings.name,
    user    : settings.username,
    password: settings.password,
    host    : settings.host,
    charset : 'utf8'
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

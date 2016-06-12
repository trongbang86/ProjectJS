var path                = require('path'),
    ROOT_FOLDER         = path.join(__dirname, '..'),
    migrationDirectory  = ROOT_FOLDER + "/migrations",
    seedDirectory       = './seeds';

module.exports = function(){
  var all = {};
  all.test = __getSettings__('test');
  all.development = __getSettings__('development');
  all.production = __getSettings__('production');
  return all;
}

/**
 * This gets the settings for each different environment
 * @param env the environment name
 */
function __getSettings__(env){
  var nconf       = require('./env').call({env: env});
  var settings    = nconf.get('database');
  var currSeedDir = seedDirectory + '/' + env;
  if(settings){
    return {
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
      },
      seeds: {
        directory: currSeedDir
      }
    };
  } else {
    return {};
  }
};
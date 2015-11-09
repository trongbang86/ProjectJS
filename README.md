## SUMMARY
This NodeJS project uses MVC architecture with Express underspinning. This can be used as a boilerplate to start a new NodeJS project.

## WHERE TO START

### Prerequisites
- Node
- NPM
- Bower
- Gulp
- PostgreSQL: This can be changed in the config/env/{{name}}.json. **NOTE**: Please change the database name and user account before running the application.

### Commands
- `npm install`: This installs all the node dependencies. This should be run before the other commands.
- `bower install`: This installs bower components.
- `gulp run`: This starts up the server. You can then open http://localhost:3000.
- `gulp test`: This is supposed to run all the test cases.
- `node bin/www`: This starts up the server like `gulp run` but doesn't prepare css, javascript and layout files.
- `npm run test-server`: Just another way of running test.

### Coding Conventions
For this project, I'm following general rules/conventions such as `__variable__` is a hidden/private variable. The same is applied for naming file. For example, `config/__bootstrapServer__.js` and `config/__bootstrapProject__.js` are not to be used independently but will be called in `config/bootstrap.js`.

### Configurations
All the configuration files are saved under config/env. Depending on which environment you are passing from the command line, it picks up the file with the matching name such as test.json or development.json

#### Loading order
The following files are used in the same order of setting up the environment.

1. \_\_{env}__.json
2. {env}.json
3. default.json

In other words, for any given key, it first checks in the `__{env}__.json` file and then the others. The reason of using `__{env}__.json` file is that developers can put their account username and password there without worrying them being checked into git and shared with others.

Just have a quick look into `.gitignore` files, you can find this line `config/env/__*__.json`.

#### Special Cases
- `rootLogFolder` is prefixed with `Project.ROOT_FOLDER`
- `logFolder` is `rootLogFolder` + '/' + `env`
- `appLogFolder` is `logFolder` + 'app'. This is used to store application logged messages.
- `accessLogFolder` is `logFolder` + 'access'. It mimics the Apache http access log.
- `gulp`: any properties under this is prefixed with `Project.ROOT_FOLDER` if its name ends with 'Folder'


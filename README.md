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
Depending on which OS your computer is running on, you might set NODE_ENV differently. For example, it would be `NODE_ENV=development gulp run` on MacOS or Linux. On Windows machines, it would be `set NODE_ENV=development && gulp run`.


- `npm install`: This installs all the node dependencies. This should be run before the other commands.
- `bower install`: This installs bower components.
- `gulp run`: This starts up the server. You can then open http://localhost:3000.
- `gulp test`: This is supposed to run all the test cases.
- `gulp db`: This does all the database migration jobs. All available options are below:

	- `gulp db --make <name_of_the_migration>`
	- `gulp db --migrate`
	- `gulp db --rollback`
	- `gulp db --version`

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

## SYSTEM ARCHITECTURE

### Model View Controller
This project follows the MVC architecture with the key directories listed below:

- frontend/views: Where views are defined. The current templating engine being used is [Handlebars](http://handlebarsjs.com/).
- server/models: the model part
- server/routes: the controller part

### The Core
Before going further, let's have a deeper understanding of the core of the project. `config/bootstrap.js` is the heart of this project. There are a number of ways to `require` this module. Given `var ProjectJS= require('config/bootstrap.js')`, we can have:

- `ProjectJS()`
This way is used when we just want to get an instance Project
- `ProjectJS(require('express')())`
This way is used to get an instance of Project and to apply all the setup for server such as where views and routes files are placed, which view engine is used and how logging for http access is done
- `ProjectJS(require('express')(), {project: AnotherProjectInstance })`
This is used when we don't want to create another Project instance but rather reusing the `AnotherProjectInstance` and to apply server settings to the instance `require('express')()`
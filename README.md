**Table of Contents**

- [SUMMARY](#)
- [WHERE TO START](#)
	- [Prerequisites](#)
	- [Commands](#)
	- [Coding Conventions](#)
	- [Configurations](#)
		- [Loading order](#)
		- [Special Cases](#)
		- [Server Port](#)
- [SYSTEM ARCHITECTURE](#)
	- [Model View Controller](#)
	- [The Core](#)
	- [The Model in MVC](#)
	- [The View in MVC](#)
	- [The Controller in MVC](#)
	- [Services](#)
	- [Best Practices](#)
		- [1. Don't use your Model directly in the controller](#)
		- [2. Don't litter the routes](#)
	- [Helpers](#)
	- [Error Handling](#)
	- [Logging](#)
- [CUSTOMISATION](#)
	- [Behind The Scene](#)
	- [Gulp](#)
		- [Structure](#)
		- [How To Find A Task](#)
- [TESTING](#)
- [PRODUCTION](#)

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
Depending on which OS your computer is running on, you might set NODE_ENV differently. For example, it would be `NODE_ENV=development gulp run` on MacOS or Linux. On Windows machines, it would be `set NODE_ENV=development && gulp run`. Also this project is set up to use [NPM Debug]. If you want to have more logging messages, you can run `DEBUG=express,ProjectJS gulp run` on Linux or `set DEBUG=express,ProjectJS && gulp run` on Windows.


- `npm install`: This installs all the node dependencies. This should be run before the other commands.
- `bower install`: This installs bower components.
- `gulp run`: This starts up the server for NODE_ENV=development. You can then open http://localhost:3000.
- `gulp test`: This is supposed to run all the test cases.
- `gulp db`: This does all the database migration jobs. All available options are below:

	- `gulp db --make <name_of_the_migration>`
	- `gulp db --migrate`
	- `gulp db --rollback`
	- `gulp db --version`
	- `gulp db --seed <name_of_the_seed_file>`

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

#### Server Port
This can be set in your `config\env\your_environment.json`
```json
{
	"database": {
	},
	"port": 3000
}
```

This number can also be changed by using environment variable `PORT`. For example, you can run `PORT=12345 gulp run` to start your server with port number `12345`.

## SYSTEM ARCHITECTURE

### Model View Controller
This project follows the MVC architecture with the key directories listed below:

- frontend/views: Where views are defined. The current templating engine being used is [Handlebars].
- server/models: the model part
- server/routes: the controller part

### The Core
Before going further, let's have a deeper understanding of the core of the project. `config/bootstrap.js` is the heart of this project. There are a number of ways to `require` this module. It gives you an instance of Project setting object. The Project setting object has access to all configurations, Models and Services. Given `var ProjectJS= require('config/bootstrap.js')`, we can have:

- `ProjectJS()`
This way is used when we just want to get an instance Project.
- `ProjectJS(require('express')())`
This way is used to get an instance of Project and to apply all the setup for server such as where views and routes files are placed, which view engine is used and how logging for http access is done.
- `ProjectJS(require('express')(), {project: AnotherProjectInstance })`
This is used when we don't want to create another Project instance but rather reusing the `AnotherProjectInstance` and to apply server settings to the instance `require('express')()` above.

### The Model in MVC
After getting an instance of Project setting object, you can access your model by `Project.Models.YourModelName`. The model name is the name of the corresponding file under _server/models_ folder. [BookShelf] framework is being used for this model layer. In short, BookShelf is a Javascript ORM for Nodejs and is built on top of [Knex] which handles the connnection pools to database. Knex is built for Postgres, MySQL, MariaDB, SQLite3, and Oracle. Hence, you can switch to any of these DBMS as you wish. The following settings need to be changed accordingly.

```json
	"database": {
		"client"	: "postgresql",
		"name"		: "database_name",
		"host"		: "localhost",
		"username"	: "postgres",
		"password"	: "123456"

	}
```

You can have access to the underlying knex instance by `Project.Models.__knex__`. To create a new model, simply create a file with the model name and place it under _server/models_ folder. An example of the initial file content is as follows:

```javascript
module.exports = function(Project, bookshelf){
	return bookshelf.Model.extend({
		tableName: 'table_name'
	});
}
```
[BookShelf] gives plenty of examples on how to extend model definition such as one-to-one, one-to-many relationships.

### The View in MVC
Views files can be found under _frontend/views_ folder. [Handlebars] is the template engine employed for this project. You can change this by changing the code in `config/__bootstrapServer__.js`. Look for the line `serverSettings.engine('html', require('hbs').__express)`.

When you start the server, the express server is configured to look for the views and templates from _.tmp/frontend/views_ instead of the _frontend/views_ folder. The reason is that some pre-processing is required for javascript and css files to be injected before hand. Hence, if you only run `node bin/www`, this pre-processing should have taken place earlier. In order to do that, you can run `gulp` with a proper task to get this done. More on this will be explained later all.

Some gulp tasks placeholders are used in the _frontend/views/layout.html_ and will be replaced as part of the processing.

```html
	<!-- build:css /static/stylesheets/all.css -->
		<!-- bower:css -->
		<!-- endbower -->

		<!-- app_bower:css -->
		<!-- endbower -->

	<!-- endbuild -->

	<!-- build:js /static/js/all.js -->
		<!-- bower:js -->
		<!-- endbower -->

		<!-- app_bower:js -->
		<!-- endbower -->
	<!-- endbuild -->
```

The section `bower:css` is used to inject css files of the bower components defined in bower.json. The section `app_bower:css` is used to inject project specific css files which are defined in _config/app_bower.json_. The same is applied for `bower:js` and `app_bower:js` for javascript files. The section `build:css` and `build:js` are the last piece of the masterpiece. They are used to look up for the files vendor.css, project.css, vendor.js and project.js and put references to them into the layout file(s).

Please be advised the order of javascript for both vendor and project can be defined in _config/app_bower.json_. An example of the file is below:

```json
{
	"name": "gokien",
  	"main": [
		".tmp/frontend/js/angular/modules/*.js",
		".tmp/frontend/js/angular/services/*.js",
		".tmp/frontend/js/angular/directives/*.js",
		".tmp/frontend/js/angular/controllers/*.js",
		".tmp/frontend/js/**/*.js",
		".tmp/frontend/stylesheets/**/*.css"
  	]
}
```

### The Controller in MVC
Controllers can be found under _server/routes_ folder. A controller file is a node module with Project setting object passed in as a parameter and is supposed to return a dictionary with 2 keys `router` and `base`. It is easier to look into examples.

```javascript
module.exports = function(Project){
	var router = require('express').Router();
	router.get('/path', function(req, res){
		res.render('aView', {key: '123'});
	});	
	return {
		base: '/parentPath',
		router: router
	}
};
```
With the above code, a `GET /parentPath/path` request will render the view `aView.html` under _frontend/views_ folder. You can access the services and models with Project.Services and Project.Models respectively. More on how to define router can be found on [Express API].

### Services
You can define your services under _server/services_ and then access it with Project.Services.YourServiceName. The name of the service will be the corresponding file's name. Following code is to show how a service can be defined.

```javascript
module.exports = function(Project){
	var Topic = Project.Models.Topic;
	return {
		customMethod: function(fields, cb) {
			Topic.save(fields).
				then(function(topic){
					cb && cb(null, topic);
				}).
				catch(function(error){
					cb && cb(error, null);
				});
		}
	}
}
```

### Best Practices
Following are only suggestions how we can structure projects to promote reusability and code quality.

#### 1. Don't use your Model directly in the controller
Yet for simple code, it's not always necessary to use a service. However, you typically happen to have code that requires access to a few different models before rendering the result to the user. Hence, it makes sense to keep all the logic in your services and reuse them accross the application.

#### 2. Don't litter the routes
After your application reaches a certain size, your routes might end up with more than hundreds lines of code to define routes with this implementation `function(req, res){}`. What you can actually do is to create sub folders under _server/routes_ to keep the logic. For example, we can have a sub folder _server/routes/user_ to have all the javascript code related to user module and then require it.

```javascript
var func = require('./users/index.js');

router.get('/path1', func.path1);
router.get('/path2', func.path2);
router.get('/path3', func.path3);
router.get('/path4', func.path4);
router.get('/path4', func.path5);
router.get('/path6', func.path6);

```

That is even easier if you define your methods as helper functions which will be addressed next.

### Helpers
Helpers can be accessed by calling `Project.Helpers.{{subFolder}}.{{yourHelperMethod}}`. There are different ways of writing helpers. As an example, we will use helpers to define our controller code.

```javascript
// File: helpers/controllers/index.js
module.exports = function(Project){
	return {
		homepage: function(req, res, next) {
		  res.render('index', { title: 'Express' });
		}
	}
}

```

and then use it to define the homepage route.

```javascript
module.exports = function(Project){
	
	/* GET home page. */
	router.get('/', Project.Helpers.controllers.homepage);

	return {
		router 	: router,
		base	: '/'
	};
};
```

Notice the way we call our `homepage` method which is `Project.Helpers.controllers.homepage` not ~~`Project.Helpers.controllers.index.homepage`~~. Hence, the filename doesn't matter here. It will only copy all the methods from all the files under _server/helpers/controllers_ folder to the object `Project.Helpers.controllers`. Since you got a hold of the route function, you can do unit testing for the method.
### Error Handling
You can utilise the concept of Helpers to write your custom code for error handling. An example has been given under `helpers/errors/index.js`
```javascript
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
```
Then you can access the function in your controllers by calling `Project.Helpers.errors.handle(response, errors)`
### Logging
There are 2 types of logging. One is [NPM Debug] and the other is [NPM Winston]. The differences are only when they are used in. In this project, [NPM Debug] is used for logging all the setup including server ports, entering/exiting a function because of its simplicity whereas [NPM Winston] is used after the project settings have been loaded such as controllers' logging, services' logging. Also [NPM Winston] has been used for file logging.

## CUSTOMISATION
This part explains how the gulp tasks are defined. After this, you can have a better understanding of the Project setting object and then be able to create more interesting code with your application.

### Behind The Scene
When you run `gulp run`, it brings up the server. For this to happen, we actually have 2 instances of Project setting object. One is used by gulp process. The other one is used by our application which is injected for all Models, Services and Routes as explained earlier. Hence, when you shut down the process. You will see 2 instances of database connections powered by [Knex] are closed at the end. It's also arguable why we need database connections for gulp tasks. It's actually up to your creativity. You can disable this behaviour.

Still why do we need to have an instance of Project setting object for gulp? The answer is that a single place of loading configuration is always a good ideas. With the initialisation of the Project setting objects, we can use the same settings for both gulp tasks and the application code.

### Gulp

#### Structure
There are 2 levels defining gulp tasks.

1. _config/gulp/{{env}}.js_
2. _config/gulp/default.js_

Anything defined in the _config/gulp/{{env}}.js_ will override the one in _config/gulp/default.js_. It's not advisable to define tasks in _config/gulp/index.js_. To define a new gulp task, consider where you want to put it in the 2 files above and following is what you should do.

```javascript
//For example, this is default.js

var	gulp 			= require('gulp'),
	Project			= null,
	__tasks__		= {};

module.exports = function(__Project__){
	Project = __Project__;
	return __tasks__;
}

__tasks__.stylesheet = function(){
	return sass(Project.gulp.frontEndStyleSheets).
		//... other code
		pipe(gulp.dest(Project.gulp.tmpStyleSheetFolder));
};
```

With this, you will have a gulp task named `stylesheet`. Hence, you can run `gulp stylesheet` in the console.

#### How To Find A Task
To have a good controll on gulp tasks, all the definitions of them are kept in _config/gulp/index.js_ and the task itself only has javascript documtation like `/* @Inherit */`. Let's have a look at the _index.js_ file.

```javascript
/**
 * Automatically loading all the tasks to gulp
 * ******************TASKS*********************
 *
 * **********DEFAULT***********
 * clean: This cleans out the .tmp folder
 * .....Some other tasks.......
 *
 * **********DEVELOPMENT***********
 * server: This runs/restarts the express server
 * .....Some other tasks.......
 *
 * **********PRODUCTION***********
 *
 * prepare: This does all the pre-processing such as javascript, stylesheets
 *			but it doesn't run the server
 * .....Some other tasks.......
 *
 */
```

As you can see, the tasks are grouped to different environments. Their implementation can be found in the corresponding file such as _config/gulp/development.js_ or _config/gulp/production.js_. As a reminder, it's good to follow the same convention so that the code can be more maintainable.

## TESTING
Currently [MochaJS] is being used to do testing. All the server testing can be found under _test/test-sever_ folder. The difference between _test-server_ and _test-other_ is that the Project setting object is created before hand for _test-server_ which can be found in _test/test-server/bootstrap.js_. Doing that helps all the test cases share the same database connection and the NODE_ENV is set to test for them. For _test-other_, you can get the Project setting object at will and shut it down when you're finished. For unit testing such as controllers, if you follow the structure describe in [Helpers](#) section, you can gain access to the controller function such as `homepage` by calling `Project.Helpers.controllers.homepage` which returns a function and you can mock the request and response parameters to pass in.

## PRODUCTION
It's desirable to not use gulp to start up the server even though it's possible. If gulp is used, it means there will be 2 processes running at the same time. One is the gulp process and the other is your web application. In order to bring up the server in production, there are 3 steps.

1. Install all prerequisite libraries
 - `npm install`
 - `bower install`
2. Database Migration
Make sure that the database schema in production is updated by running `NODE_ENV=production gulp db --migrate`.
3. Pre-processing static content
Javascript, stylesheet and view layout files can be processed and placed under _.tmp_ folder correctly by running `NODE_ENV=production gulp prepare`.
4. Run the server
You can bring up the server by running `NODE_ENV=production node bin/www` from the root of your project's folder.

<!---
	Links used in this README.md
-->
[Handlebars]: http://handlebarsjs.com
[Knex]: http://knexjs.org
[BookShelf]: http://bookshelfjs.org
[Express API]: http://expressjs.com/api.html
[MochaJS]: https://mochajs.org
[NPM Debug]: https://www.npmjs.com/package/debug
[NPM Winston]: https://www.npmjs.com/package/winston
/* registering global variables as testing utilities */
global._ 		= require('underscore');
global.expect	= require('chai').expect;

/* loading the environment */
process.env.NODE_ENV= 'test';
require('../../app.js');
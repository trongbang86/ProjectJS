var express     = require('express'),
    router      = express.Router();



module.exports = function(Project){

    return {
        router  : router,
        base    : '/ThisIsForTestingOnly'
    };
};


angular.module('SimpleApp', []);

angular.module('SimpleApp').config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('//');
	$interpolateProvider.endSymbol('//');
});

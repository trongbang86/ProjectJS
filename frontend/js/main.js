angular.module('YourApp', []);

angular.module('YourApp').config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('//');
	$interpolateProvider.endSymbol('//');
});
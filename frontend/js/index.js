angular.module('SimpleApp').controller('IndexController', function($scope, $window) {
	$scope.cancel = function($event){
		$event.preventDefault();
		$window.location.href= '/';	
	} 
}); 

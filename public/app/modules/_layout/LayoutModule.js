APP.controller('HeaderController', function($scope, $state, authManager, $rootScope) {
	$scope.logout = function($event) {
		$event.preventDefault();
		localStorage.removeItem('api_token');
		authManager.unauthenticate();
	}

});
APP.controller('HeaderController', function($scope, $state, authManager) {
	$scope.logout = function($event) {
		$event.preventDefault();
		localStorage.removeItem('api_token');
		authManager.unauthenticate();
	}
});
APP.controller('HeaderController', function($scope, $state, authManager, $rootScope) {
	$scope.logout = function($event) {
		$event.preventDefault();
		localStorage.removeItem('api_token');
		authManager.unauthenticate();
	}

	let count = document.getElementsByClassName('element').length;

	$scope.text = count;

});
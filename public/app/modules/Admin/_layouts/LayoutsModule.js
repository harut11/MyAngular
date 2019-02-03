APP.controller('AdminSidebarController' , function($scope, $state, authManager) {
	$scope.logout = function($event) {
		$event.preventDefault();
		localStorage.removeItem('api_admin_token');
		authManager.unauthenticate();
		$state.go('/');
	}
});
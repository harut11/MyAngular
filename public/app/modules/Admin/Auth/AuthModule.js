APP.controller('AdminAuthController', function($scope, $stateParams, AuthService, toastr, $state) {
	$scope.admin = {
		email: null,
		password: null
	};

	$scope.login = function() {
		AuthService.adminLogin($scope.admin, (res) => {
			if(res.access_token) {
				localStorage.setItem('api_admin_token', res.access_token);
				$state.go('dashboard');
			}
		}, (err) => {
			if(err.status === 401) {
				toastr.error('Email or Password incorrect.');
			}
		});
	}
});
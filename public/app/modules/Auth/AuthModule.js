APP.controller('AuthLoginController', function ($scope, AuthService, toastr, $state) {
	$scope.user = {
		email: null,
		password: null
	};

	$scope.login = function () {
		AuthService.login($scope.user, (res) => {
			if(res.access_token) {
				localStorage.setItem('api_token', res.access_token);
				$state.go('/');
			}

		}, (err) => {
			if(err.status === 401) {
				toastr.error('Email or Password incorrect!');
			}
		});
	}
});


APP.controller('AuthRegisterController', function($scope, AuthService, toastr) {
	$scope.user = {
		name: null,
		email: null,
		password: null
	};

	$scope.register = function () {
		AuthService.register($scope.user, (res) => {
			toastr.success('Successfully registered.');
		}, (err) => console.log(err));
	}
});

APP.controller('AuthForgotController', function($scope, AuthService, toastr) {
	$scope.email = null;

	$scope.reset = function() {
		AuthService.reset({email: $scope.email}, (res) => {
			$scope.email = null;
			toastr.success('Please check your email.');
		}, (err) => console.log(err));
	}
});

APP.controller('AuthResetController', function($scope, AuthService, $toastr, $state, $stateParams) {
	$scope.user = {
		password: null,
		password_confirmation: null,
		token: $stateParams.token
	};

	$scope.reset = function() {
		AuthService.setPassword($scope.user, (res) => {
			$scope.email = null;
			toastr.succes('Successfully reset.');
			$state.go('login');
		}, (err) => console.log(err));
	}
});

APP.controller('AuthVerifyController', function($stateParams, AuthService, toastr, $state) {
	AuthService.verify({token: $stateParams.token}, () => {
		toastr.success('You have successfuly verified!');
		$state.go('login');
	}, (err) => {
		$state.go('/');
	})
});
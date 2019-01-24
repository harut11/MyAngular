APP.config(function ($stateProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			views: {
				'content@': {
					templateUrl: 'app/Modules/Auth/views/login.html',
					controller: 'AuthLoginController'
				}
			},
			data: {
                requiresLogin: false
            }
		})

		.state('register', {
			url: '/register',
			views: {
				'content@': {
					templateUrl: 'app/Modules/Auth/views/register.html',
					controller: 'AuthRegisterController'
				}
			},
			data: {
                requiresLogin: false
            }
		})

		.state('forgot', {
			url: '/forgot',
			views: {
				'content@': {
					templateUrl: 'app/Modules/Auth/views/forgot.html',
					controller: 'AuthForgotController'
				}
			},
			data: {
                requiresLogin: false
            }
		})

		.state('reset', {
			url: '/set-password/:token',
			views: {
				'content@': {
					templateUrl: 'app/Modules/Auth/views/reset.html',
					controller: 'AuthResetController'
				}
			},
			data: {
				requiresLogin: false
			}
		})

		.state('verify', {
			url: '/verify/:token',
			views: {
				'content@': {
					controller: 'AuthVerifyController'
				}
			},
			data: {
                requiresLogin: false
            }
		})
});
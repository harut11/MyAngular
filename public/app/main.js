const APP = angular.module('app', ['ui.router', 'ngResource', 'ngAnimate', 'toastr', 'angular-jwt']);

APP.config(["$locationProvider", function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

APP.config(function Config(toastrConfig, jwtOptionsProvider, $httpProvider) {
    angular.extend(toastrConfig, {
        allowHtml: true,
        closeButton: true,
        extendedTimeOut: 1000,
        progressBar: true,
        tapToDismiss: true,
        timeOut: 5000
    });

    jwtOptionsProvider.config({
        unauthenticatedRedirectPath: '/login',
        tokenGetter: [function() {
            return localStorage.getItem('api_token');
        }]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
});

APP.run(function ($rootScope, $state, authManager, $transitions) {
	authManager.checkAuthOnRefresh();
	authManager.redirectWhenUnauthenticated();

	$rootScope.$on('tokenHasExpired', function() {
        alert('Your token is expired.');
    });

    $transitions.onEnter({}, function (transition, state) {
    	if (state.data && state.data.requiresLogin === false) {
    		const token = localStorage.getItem('api_token');

    		if (token !== null) {
    			return transition.router.stateService.target('/');
    		}
    	}
    });
});

APP.factory('errorInterceptors', ['$injector', function($injector) {
	let service = {};

	service.responceError = function(responce) {
		if (responce.status === 422) {
			let toastr = $injector.get('toastr');
			let errorText = '';
			Object.values(response.data.errors).map(function(item) {
				errorText += item.join('<br>') + '<br>';
			});
			toastr.errors(errorText);
		}
		throw responce;
	};
	return service;
}]);

APP.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('errorInterceptors');
}]);
APP.config(function($stateProvider) {
	$stateProvider
		.state('admin', {
			url : '/admin',
			views : {
				'content@' : {
					templateUrl : 'app/modules/Admin/Auth/views/login.html',
					controller : 'AdminAuthController'
				}
			},
			data : {
				isAdmin : true,
				requiresAdminLogin : false
			}
		})
});
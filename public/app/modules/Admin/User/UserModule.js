APP.controller('AdminUserController',function($scope, $stateParams, AuthService,$state, UserService) {
	$scope.users = [];

	$scope.getUsers = function(page) {
		UserService.get({page: page}, (res) => {
			$scope.users = res.users.data;

			$scope.pagination = {
				last_page   : new Array(res.users.last_page),
				currentPage : res.users.current_page
			}
		})
	}
	$scope.getUsers(1);
});
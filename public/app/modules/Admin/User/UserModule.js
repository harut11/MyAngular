APP.controller('AdminUserController',function($scope, $stateParams, AuthService,$state, UserService, $rootScope) {
	$scope.users = [];
	let count = [];
	$rootScope.userCount = count.length;

	$scope.getUsers = function(page) {
		UserService.get({page: page}, (res) => {
			$scope.users = res.users.data;

			$scope.pagination = {
				last_page   : new Array(res.users.last_page),
				currentPage : res.users.current_page
			}
		});
		UserService.get({}, (res) => {
			let arr = res.users.data,
				arrlength = arr.length;
			for(let i = 0; i < arrlength; i++) {
				count.push(arr[i]);
			}
		});
	}
	$scope.getUsers(1);
});

APP.controller('AdminUserShowController', function($scope, UserService, $stateParams) {
	$scope.user = {};

	UserService.show({id : $stateParams.id}, (res) => {
		$scope.user = res.user;
	})
});

APP.controller('AdminUserEditController', function($scope, UserService, $stateParams, $state) {
	let isAdminEdit = $stateParams.slug != 0;
	$scope.text = !isAdminEdit ? 'Create ' : 'edit ';

	

	UserService.get({}, function (res) {
		$scope.users = res.users;
	});

	if(isAdminEdit) {
		UserService.show({id: $stateParams.id}, (res) => {
			$scope.user = res.user;
		})
	}

	$scope.save = function() {
		if(isAdminEdit) {
			UserService.update({id: $stateParams.id}, $scope.users, (res) => {
				$state.go('user');
			})
		} else {
			UserService.store($scope.users, (res) => {
				$state.go('user');
			})
		}
	}
});

APP.controller('AdminUserDeleteController', function($scope, UserService, $stateParams, $state, toastr) {
	$scope.delete = function() {
		UserService.delete({id: $stateParams.id}, (res) => {
			$state.go('user');
			toastr.success('Successfully deleted!')
		})
	}
});

APP.controller('AdminCategoryController',function($scope, $stateParams, AuthService,$state, CategoryService) {
	$scope.categories = [];
	$scope.pagination = {};

	$scope.getCategory = function(page) {
		CategoryService.get({page: page}, (res) => {
			$scope.categories = res.categories.data;

			$scope.pagination = {
				last_page   : new Array(res.categories.last_page),
				currentPage : res.categories.current_page
			}
		})
	}
	$scope.getCategory(1);
});

APP.controller('AdminCategoryEditController', function($scope, CategoryService, $stateParams, $state) {
	let isAdminEdit = $stateParams.slug != 0;
	$scope.text = !isAdminEdit ? 'Create ' : 'edit ';

	$scope.categories = {};

	

	CategoryService.get({}, function (res) {
		$scope.categories = res.categories;
	});

	if(isAdminEdit) {
		CategoryService.show({slug: $stateParams.slug}, (res) => {
			$scope.categories = res.categories;
		})
	}

	$scope.save = function() {
		if(isAdminEdit) {
			CategoryService.update({slug: $stateParams.slug}, $scope.categories, (res) => {
				$state.go('category');
			})
		} else {
			CategoryService.store($scope.category, (res) => {
				$state.go('category');
			})
		}
	}
});

APP.controller('AdminCategoryDeleteController', function($scope, CategoryService, $stateParams, $state, toastr) {
	$scope.delete = function() {
		CategoryService.delete({slug: $stateParams.slug}, (res) => {
			$state.go('category');
			toastr.success('Successfully deleted!')
		})
	}
});
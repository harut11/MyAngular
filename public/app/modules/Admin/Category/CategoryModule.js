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
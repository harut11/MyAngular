APP.controller('ProductIndexController', function($scope, ProductService) {
	$scope.products = [];

	ProductService.get({page : 1}, (res) => {
		$scope.products = res.products.data;
	})
});

APP.controller('ProductShowController', function($scope, ProductService, $stateParams) {
	$scope.product = {};

	ProductService.show({id : $stateParams.slug}, (res) => {
		$scope.product = res.product;
	})
});

APP.controller('ProductEditController', function($scope, ProductService, $stateParams) {
	$scope.product = {};

	ProductService.edit({id : $stateParams.slug}, (res) => {
		$scope.product = res.product;
	})
});

APP.controller('ProductDeleteController', function($scope, ProductService, $stateParams) {
	$scope.product = {};

	ProductService.delete({id : $stateParams.slug}, (res) => {

	})
});
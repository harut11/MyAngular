APP.controller('HomeIndexController', function($scope, UserProductService, $rootScope) {
	$scope.products = [];
	$scope.pagination = {};
	$scope.image = {};
	$rootScope.cartItems = [];

	$scope.getProducts = function(page) {
		UserProductService.get({page: page}, (res) => {
			$scope.products = res.products.data;
			$scope.image = res.image;

			$scope.pagination = {
				last_page   : new Array(res.products.last_page),
				currentPage : res.products.current_page
			}
		})
	}
	$scope.getProducts(1);

	$scope.addCart = function(slug) {

		UserProductService.show({slug : slug}, (res) => {
			$rootScope.cartItems.push(res.product);
			console.log(res);
		});

		console.log($rootScope.cartItems);
	}
});
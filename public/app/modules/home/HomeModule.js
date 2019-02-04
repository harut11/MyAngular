APP.controller('HomeIndexController', function($scope, UserProductService, $rootScope) {
	$scope.products = [];
	$scope.pagination = {};
	$scope.image = {};
	$rootScope.cartItems = [];
	$rootScope.cartCount = 0;
	$rootScope.wishItems = [];
	$rootScope.wishCount = 0;

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

	$rootScope.addCart = function(slug) {
		
		UserProductService.show({slug : slug}, (res) => {
			$rootScope.cartItems.push(res.product);
		});

		$rootScope.cartCount += 1;
	}

	$rootScope.addWish = function(slug) {

		UserProductService.show({slug : slug}, (res) => {
			$rootScope.wishItems.push(res.product);
		});

		$rootScope.wishCount += 1;
	}
});

APP.controller('HomeShowController', function($scope, UserProductService, $stateParams) {
	$scope.product = {};

	UserProductService.show({slug : $stateParams.slug}, (res) => {
		$scope.product = res.product;
	})
});
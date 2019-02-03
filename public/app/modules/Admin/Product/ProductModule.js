APP.controller('AdminProductController',function($scope, $stateParams, AuthService,$state, ProductService) {
	$scope.products = [];
	$scope.pagination = {};

	$scope.getProducts = function(page) {
		ProductService.get({page: page}, (res) => {
			$scope.products = res.products.data;

			$scope.pagination = {
				last_page   : new Array(res.products.last_page),
				currentPage : res.products.current_page
			}
		})
	}
	$scope.getProducts(1);
});

APP.controller('AdminProductShowController', function($scope, ProductService, $stateParams) {
	$scope.product = {};

	ProductService.show({slug : $stateParams.slug}, (res) => {
		$scope.product = res.product;
	})
});

APP.controller('AdminProductEditController', function($scope, ProductService, $stateParams, CategoryService, $state, Upload) {
	let isAdminEdit = $stateParams.slug != 0;
	$scope.text = !isAdminEdit ? 'Create ' : 'edit ';
	$scope.files = [];

	$scope.uploadFiles = function (files, slug) {
		if(files && files.length) {
			return Upload.upload({
				url: 'api/products/images',
				data: {
					file: files,
					slug: slug
				}
			});
		}
	};

	$scope.categories = [];

	$scope.product = {
		category_id: ''
	};

	CategoryService.get({}, function (res) {
		$scope.categories = res.categories;
	});

	if(isAdminEdit) {
		ProductService.show({slug: $stateParams.slug}, (res) => {
			$scope.product = res.product;
		})
	}

	$scope.save = function() {
		if(isAdminEdit) {
			$scope.uploadFiles($scope.file, $stateParams.slug);
			ProductService.update({slug: $stateParams.slug}, $scope.product, (res) => {
				$state.go('product');
			})
		} else {
			ProductService.store($scope.product, (res) => {
				$scope.uploadFiles($scope.files, res.slug).then(() => {
					$state.go('product');
				});
			})
		}
	}
});

APP.controller('AdminProductDeleteController', function($scope, ProductService, $stateParams, $state, toastr) {
	$scope.delete = function() {
		ProductService.delete({slug: $stateParams.slug}, (res) => {
			$state.go('product');
			toastr.success('Successfully deleted!')
		})
	}
});
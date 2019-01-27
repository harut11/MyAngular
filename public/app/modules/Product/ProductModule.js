APP.controller('ProductIndexController', function($scope, ProductService) {
	$scope.products = [];

	ProductService.get({page : 1}, (res) => {
		$scope.products = res.products.data;
	})
});

APP.controller('ProductShowController', function($scope, ProductService, $stateParams) {
	$scope.product = {};

	ProductService.show({slug : $stateParams.slug}, (res) => {
		$scope.product = res.product;
	})
});

APP.controller('ProductEditController', function($scope, ProductService, $stateParams, CategoryService, $state, Upload) {
	const isEdit = $stateParams.slug != 0;
	$scope.text = !isEdit ? 'Create ' : 'edit ';
	$scope.files = [];

	$scope.uploadFiles = function (files) {
		if(files && files.length) {
			Upload.upload({
				url: 'api/products/images',
				data: {
					file: files,
					slug: $stateParams.slug
				}
			}).then((res) => {

			});
		}
	}

	$scope.categories = [];

	$scope.product = {
		category_id: ''
	};

	CategoryService.get({}, function (res) {
		$scope.categories = res.categories;
	});

	if(isEdit) {
		ProductService.show({slug: $stateParams.slug}, (res) => {
			$scope.product = res.product;
		})
	}

	$scope.save = function() {
		if(isEdit) {
			$scope.uploadFiles($scope.file);
			ProductService.update({slug: $stateParams.slug}, $scope.product, (res) => {
				$state.go('products');
			})
		} else {
			ProductService.store($scope.product, (res) => {
				$state.go('products');
			})
		}
	}
});

APP.controller('ProductDeleteController', function($scope, ProductService, $stateParams, $state, toastr) {
	$scope.delete = function() {
		ProductService.delete({slug: stateParams.slug}, (res) => {
			$state.go('products');
			toastr.success('Successfully deleted!')
		})
	}
});
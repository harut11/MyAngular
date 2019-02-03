APP.factory('UserProductService', ['$resource', function($resource) {
	return $resource('api/products/:slug', {slug: '@slug'}, {
		get     : {method : 'GET'},
        show    : {method : 'GET'},
	});
}]);
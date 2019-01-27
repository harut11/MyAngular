APP.factory('ProductService', ['$resource', function($resource) {
	return $resource('/api/products/:slug', {slug: '@slug'}, {
		get     : {method : 'GET'},
		edit    : {method : 'GET'},
		update  : {method : 'PUT'},
        store   : {method : 'POST'},
        show    : {method : 'GET'},
        delete  : {method : 'DELETE'},
	});
}]);
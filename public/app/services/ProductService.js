APP.factory('ProductService', ['$resource', function($resource) {
	return $resource('/api/products/:id', {id: '@id'}, {
		get     : {method : 'GET'},
		update  : {method : 'PUT'},
        store   : {method : 'POST'},
        show    : {method : 'GET'},
        delete  : {method : 'DELETE'},
	});
}]);
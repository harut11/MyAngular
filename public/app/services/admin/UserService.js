APP.factory('UserService', ['$resource', function($resource) {
	return $resource('/api/admin/users/:id', {id: '@id'}, {
		get     : {method : 'GET'},
		update  : {method : 'PUT'},
        store   : {method : 'POST'},
        show    : {method : 'GET'},
        delete  : {method : 'DELETE'},
	});
}]);
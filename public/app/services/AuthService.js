APP.factory('AuthService', ['$resource', function($resource) {
    return $resource('/api/auth/:id', {id: '@id'}, {
        register: {
            url : '/api/auth/register',
            method: 'POST',
            skipAuthorization: true,
        },
        login : {
            url : '/api/auth/login',
            method: 'POST',
            skipAuthorization: true,
        },
        setPassword : {
            url : '/api/auth/set-password',
            method: 'POST',
            skipAuthorization: true,
        },
        reset : {
            url : '/api/auth/reset',
            method: 'POST',
            skipAuthorization: true,
        },
        verify : {
            url : '/api/auth/verify',
            method: 'POST',
            skipAuthorization: true,
        },
        adminLogin : {
          url : '/api/auth/adminLogin',
          method : 'POST',
          skipAuthorization : true
        },
    });
}]);
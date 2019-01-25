var APP = angular.module('app', ['ui.router', 'ngResource', 'ngAnimate', 'toastr', 'angular-jwt']);
APP.config(["$locationProvider", function ($locationProvider) {
  $locationProvider.html5Mode(true);
}]);
APP.config(function Config(toastrConfig, jwtOptionsProvider, $httpProvider) {
  angular.extend(toastrConfig, {
    allowHtml: true,
    closeButton: true,
    extendedTimeOut: 1000,
    progressBar: true,
    tapToDismiss: true,
    timeOut: 5000
  });
  jwtOptionsProvider.config({
    unauthenticatedRedirectPath: '/login',
    tokenGetter: [function () {
      return localStorage.getItem('api_token');
    }]
  });
  $httpProvider.interceptors.push('jwtInterceptor');
});
APP.run(function ($rootScope, $state, authManager, $transitions) {
  authManager.checkAuthOnRefresh();
  authManager.redirectWhenUnauthenticated();
  $rootScope.$on('tokenHasExpired', function () {
    alert('Your token is expired.');
  });
  $transitions.onEnter({}, function (transition, state) {
    if (state.data && state.data.requiresLogin === false) {
      var token = localStorage.getItem('api_token');

      if (token !== null) {
        return transition.router.stateService.target('/');
      }
    }
  });
});
APP.factory('errorInterceptors', ['$injector', function ($injector) {
  var service = {};

  service.responceError = function (responce) {
    if (responce.status === 422) {
      var _toastr = $injector.get('toastr');

      var errorText = '';
      Object.values(response.data.errors).map(function (item) {
        errorText += item.join('<br>') + '<br>';
      });

      _toastr.errors(errorText);
    }

    throw responce;
  };

  return service;
}]);
APP.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptors');
}]);
APP.factory('AuthService', ['$resource', function ($resource) {
  return $resource('/api/auth/:id', {
    id: '@id'
  }, {
    register: {
      url: '/api/auth/register',
      method: 'POST',
      skipAuthorization: true
    },
    login: {
      url: '/api/auth/login',
      method: 'POST',
      skipAuthorization: true
    },
    verify: {
      url: '/api/auth/verify',
      method: 'POST',
      skipAuthorization: true
    },
    reset: {
      url: '/api/auth/reset',
      method: 'POST'
    },
    setPassword: {
      url: '/api/auth/set-password',
      method: 'POST'
    }
  });
}]);
APP.factory('ProductService', ['$resource', function ($resource) {
  return $resource('/api/products/:id', {
    id: '@id'
  }, {
    get: {
      method: 'GET'
    },
    update: {
      method: 'PUT'
    },
    store: {
      method: 'POST'
    },
    show: {
      method: 'GET'
    },
    delete: {
      method: 'DELETE'
    }
  });
}]);
APP.controller('HeaderController', function ($scope, $state, authManager) {
  $scope.logout = function (event) {
    $event.preventDefault();
    localStorage.removeItem('api_token');
    authManager.unauthenticate();
  };
});
APP.controller('AboutIndexController', function () {});
APP.controller('AuthLoginController', function ($scope, AuthService, toastr, $state) {
  $scope.user = {
    email: null,
    password: null
  };

  $scope.login = function () {
    AuthService.login($scope.user, function (res) {
      if (res.access_token) {
        localStorage.setItem('api_token', res.access_token);
        $state.go('/');
      }
    }, function (err) {
      if (err.status === 401) {
        toastr.error('Email or Password incorrect!');
      }
    });
  };
});
APP.controller('AuthRegisterController', function ($scope, AuthService, toastr) {
  $scope.user = {
    name: null,
    email: null,
    password: null
  };

  $scope.register = function () {
    AuthService.register($scope.user, function (res) {
      toastr.success('Successfully registered.');
    }, function (err) {
      return console.log(err);
    });
  };
});
APP.controller('AuthForgotController', function ($scope, AuthService, toastr) {
  $scope.email = null;

  $scope.reset = function () {
    AuthService.reset({
      emial: $scope.email
    }, function (res) {
      $scope.email = null;
      toastr.success('Please check your email.');
    }, function (err) {
      return console.log(err);
    });
  };
});
APP.controller('AuthResetController', function ($scope, AuthService, $toastr, $state, $stateParams) {
  $scope.user = {
    password: null,
    password_confirmation: null,
    token: $stateParams.token
  };

  $scope.reset = function () {
    AuthService.setPassword($scope.user, function (res) {
      $scope.email = null;
      toastr.succes('Successfully reset.');
      $state.go('login');
    }, function (err) {
      return console.log(err);
    });
  };
});
APP.controller('AuthVerifyController', function ($stateParams, AuthService, toastr, $state) {
  AuthService.verify({
    token: $stateParams.token
  }, function () {
    toastr.success('You have successfuly verified!');
    $state.go('login');
  }, function (err) {
    $state.go('/');
  });
});
APP.controller('HomeIndexController', function () {});
APP.controller('ProductIndexController', function ($scope, ProductService) {
  $scope.products = [];
  ProductService.get({
    page: 1
  }, function (res) {
    $scope.products = res.products.data;
  });
});
APP.controller('ProductShowController', function ($scope, ProductService, $stateParams) {
  $scope.product = {};
  ProductService.show({
    id: $stateParams.slug
  }, function (res) {
    $scope.product = res.product;
  });
});
APP.controller('ProductEditController', function ($scope, ProductService, $stateParams) {
  $scope.product = {};
  ProductService.edit({
    id: $stateParams.slug
  }, function (res) {
    $scope.product = res.product;
  });
});
APP.controller('ProductDeleteController', function ($scope, ProductService, $stateParams) {
  $scope.product = {};
  ProductService.delete({
    id: $stateParams.slug
  }, function (res) {});
});
APP.config(function ($stateProvider) {
  $stateProvider.state('about', {
    url: "/about",
    views: {
      'content@': {
        templateUrl: "/app/modules/About/views/index.html",
        controller: "AboutIndexController"
      }
    },
    data: {
      requiresLogin: true
    }
  });
});
APP.config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    views: {
      'content@': {
        templateUrl: 'app/Modules/Auth/views/login.html',
        controller: 'AuthLoginController'
      }
    },
    data: {
      requiresLogin: false
    }
  }).state('register', {
    url: '/register',
    views: {
      'content@': {
        templateUrl: 'app/Modules/Auth/views/register.html',
        controller: 'AuthRegisterController'
      }
    },
    data: {
      requiresLogin: false
    }
  }).state('forgot', {
    url: '/forgot',
    views: {
      'content@': {
        templateUrl: 'app/Modules/Auth/views/forgot.html',
        controller: 'AuthForgotController'
      }
    },
    data: {
      requiresLogin: false
    }
  }).state('reset', {
    url: '/set-password/:token',
    views: {
      'content@': {
        templateUrl: 'app/Modules/Auth/views/reset.html',
        controller: 'AuthResetController'
      }
    },
    data: {
      requiresLogin: false
    }
  }).state('verify', {
    url: '/verify/:token',
    views: {
      'content@': {
        controller: 'AuthVerifyController'
      }
    },
    data: {
      requiresLogin: false
    }
  });
});
APP.config(function ($stateProvider) {
  $stateProvider.state('/', {
    url: "/",
    views: {
      'header@': {
        templateUrl: "/app/modules/_layout/views/_header.html",
        controller: "HeaderController"
      },
      'content@': {
        templateUrl: "/app/modules/Home/views/index.html",
        controller: "HomeIndexController"
      },
      'footer@': {
        templateUrl: "/app/modules/_layout/views/_footer.html",
        controller: "HomeIndexController"
      }
    }
  });
});
APP.config(function ($stateProvider) {
  $stateProvider.state('products', {
    url: "/products",
    views: {
      'header@': {
        templateUrl: "/app/modules/_layout/views/_header.html",
        controller: "HeaderController"
      },
      'content@': {
        templateUrl: "/app/modules/Product/views/index.html",
        controller: "ProductIndexController"
      }
    }
  }).state('products.show', {
    url: "/:slug/show",
    views: {
      'header@': {
        templateUrl: "/app/modules/_layout/views/_header.html",
        controller: "HeaderController"
      },
      'content@': {
        templateUrl: "/app/modules/Product/views/show.html",
        controller: "ProductShowController"
      }
    }
  }).state('products.edit', {
    url: "/:slug/edit",
    views: {
      'header@': {
        templateUrl: "/app/modules/_layout/views/_header.html",
        controller: "HeaderController"
      },
      'content@': {
        templateUrl: "/app/modules/Product/views/edit.html",
        controller: "ProductEditController"
      }
    }
  }).state('products.delete', {
    url: "/:slug/delete",
    views: {
      'header@': {
        templateUrl: "/app/modules/_layout/views/_header.html",
        controller: "HeaderController"
      },
      'content@': {
        templateUrl: "/app/modules/Product/views/delete.html",
        controller: "ProductDeleteController"
      }
    }
  });
});

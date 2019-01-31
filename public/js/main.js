var APP = angular.module('app', ['ui.router', 'ngResource', 'ngAnimate', 'toastr', 'angular-jwt', 'ngFileUpload']);
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
    tokenGetter: ['options', function (options) {
      if (options && options.url.indexOf('/admin') > -1) {
        return localStorage.getItem('api_admin_token');
      } else {
        return localStorage.getItem('api_token');
      }
    }]
  });
  $httpProvider.interceptors.push('jwtInterceptor');
});
APP.run(function ($rootScope, $state, authManager, $transitions) {
  authManager.checkAuthOnRefresh();
  authManager.redirectWhenUnauthenticated();
  $rootScope.$on('tokenHasExpired', function () {
    localStorage.removeItem('api_token');
    alert('Your token is expired.');
  });
  $transitions.onEnter({}, function (transition, state) {
    if (state.data && state.data.isAdmin && state.data.requiresAdminLogin === false) {
      var token = localStorage.getItem('api_admin_token');

      if (token !== null) {
        return transition.router.stateService.target('dashboard');
      }
    }

    if (state.data && state.requiresLogin === false) {
      var _token = localStorage.getItem('api_token');

      if (_token !== null) {
        return transition.router.stateService.target('/');
      }
    }
  });
});
APP.factory('errorInterceptors', ['$injector', function ($injector) {
  var service = {};

  service.responseError = function (response) {
    if (response.status === 422) {
      var _toastr = $injector.get('toastr');

      var errorText = '';
      Object.values(response.data.errors).map(function (item) {
        errorText += item.join('<br>') + '<br>';
      });

      _toastr.error(errorText);
    }

    throw response;
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
    setPassword: {
      url: '/api/auth/set-password',
      method: 'POST',
      skipAuthorization: true
    },
    reset: {
      url: '/api/auth/reset',
      method: 'POST',
      skipAuthorization: true
    },
    verify: {
      url: '/api/auth/verify',
      method: 'POST',
      skipAuthorization: true
    },
    adminLogin: {
      url: '/api/auth/adminLogin',
      method: 'POST',
      skipAuthorization: true
    }
  });
}]);
APP.factory('CategoryService', ['$resource', function ($resource) {
  return $resource('/api/categories/:slug', {
    slug: '@slug'
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
APP.factory('ProductService', ['$resource', function ($resource) {
  return $resource('/api/products/:slug', {
    slug: '@slug'
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
  $scope.logout = function ($event) {
    $event.preventDefault();
    localStorage.removeItem('api_token');
    authManager.unauthenticate();
  };
});
APP.controller('AboutIndexController', function () {});
APP.controller('AdminAuthController', function ($scope, $stateParams, AuthService, toastr, $state) {
  $scope.admin = {
    email: null,
    password: null
  };

  $scope.login = function () {
    AuthService.adminLogin($scope.admin, function (res) {
      if (res.access_token) {
        localStorage.setItem('api_admin_token', res.access_token);
        $state.go('dashboard');
      }
    }, function (err) {
      if (err.status === 401) {
        toastr.error('Email or Password incorrect.');
      }
    });
  };
});
APP.controller('AdminDashboardController', function ($scope, $stateParams, toastr, AuthService, $state) {});
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
        toastr.error('Email or Password incorrect.');
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
      email: $scope.email
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
    toastr.success('You have successfully verified.');
    $state.go('login');
  }, function (err) {
    $state.go('/');
  });
});
APP.controller('HomeIndexController', function () {});
APP.controller('ProductIndexController', function ($scope, ProductService) {
  $scope.products = [];
  $scope.pagination = {};

  $scope.getProducts = function (page) {
    ProductService.get({
      page: page
    }, function (res) {
      $scope.products = res.products.data;
      $scope.pagination = {
        last_page: new Array(res.products.last_page),
        currentPage: res.products.current_page
      };
    });
  };

  $scope.getProducts(1);
});
APP.controller('ProductShowController', function ($scope, ProductService, $stateParams) {
  $scope.product = {};
  ProductService.show({
    slug: $stateParams.slug
  }, function (res) {
    $scope.product = res.product;
  });
});
APP.controller('ProductEditController', function ($scope, ProductService, $stateParams, CategoryService, $state, Upload) {
  var isEdit = $stateParams.slug != 0;
  $scope.text = !isEdit ? 'Create ' : 'edit ';
  $scope.files = [];

  $scope.uploadFiles = function (files, slug) {
    if (files && files.length) {
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

  if (isEdit) {
    ProductService.show({
      slug: $stateParams.slug
    }, function (res) {
      $scope.product = res.product;
    });
  }

  $scope.save = function () {
    if (isEdit) {
      $scope.uploadFiles($scope.file, $stateParams.slug);
      ProductService.update({
        slug: $stateParams.slug
      }, $scope.product, function (res) {
        $state.go('products');
      });
    } else {
      ProductService.store($scope.product, function (res) {
        $scope.uploadFiles($scope.files, res.slug).then(function () {
          $state.go('products');
        });
      });
    }
  };
});
APP.controller('ProductDeleteController', function ($scope, ProductService, $stateParams, $state, toastr) {
  $scope.delete = function () {
    ProductService.delete({
      slug: stateParams.slug
    }, function (res) {
      $state.go('products');
      toastr.success('Successfully deleted!');
    });
  };
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
  $stateProvider.state('admin', {
    url: '/admin',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Auth/views/login.html',
        controller: 'AdminAuthController'
      }
    },
    data: {
      isAdmin: true,
      requiresAdminLogin: false
    }
  });
});
APP.config(function ($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/admin/dashboard',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Dashboard/views/index.html',
        controller: 'AdminDashboardController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
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

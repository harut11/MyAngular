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
APP.factory('CategoryService', ['$resource', function ($resource) {
  return $resource('/api/admin/categories/:slug', {
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
  return $resource('api/admin/products/:slug', {
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
APP.factory('UserService', ['$resource', function ($resource) {
  return $resource('/api/admin/users/:id', {
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
APP.factory('UserProductService', ['$resource', function ($resource) {
  return $resource('api/products/:slug', {
    slug: '@slug'
  }, {
    get: {
      method: 'GET'
    },
    show: {
      method: 'GET'
    }
  });
}]);
APP.controller('HeaderController', function ($scope, $state, authManager, $rootScope) {
  $scope.logout = function ($event) {
    $event.preventDefault();
    localStorage.removeItem('api_token');
    authManager.unauthenticate();
  };
});
APP.controller('AboutIndexController', function () {});
APP.controller('AdminSidebarController', function ($scope, $state, authManager) {
  $scope.logout = function ($event) {
    $event.preventDefault();
    localStorage.removeItem('api_admin_token');
    authManager.unauthenticate();
    $state.go('/');
  };
});
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
APP.controller('AdminCategoryController', function ($scope, $stateParams, AuthService, $state, CategoryService) {
  $scope.categories = [];
  $scope.pagination = {};

  $scope.getCategory = function (page) {
    CategoryService.get({
      page: page
    }, function (res) {
      $scope.categories = res.categories.data;
      $scope.pagination = {
        last_page: new Array(res.categories.last_page),
        currentPage: res.categories.current_page
      };
    });
  };

  $scope.getCategory(1);
});
APP.controller('AdminCategoryEditController', function ($scope, CategoryService, $stateParams, $state) {
  var isAdminEdit = $stateParams.slug != 0;
  $scope.text = !isAdminEdit ? 'Create ' : 'edit ';
  $scope.categories = {};
  CategoryService.get({}, function (res) {
    $scope.categories = res.categories;
  });

  if (isAdminEdit) {
    CategoryService.show({
      slug: $stateParams.slug
    }, function (res) {
      $scope.categories = res.categories;
    });
  }

  $scope.save = function () {
    if (isAdminEdit) {
      CategoryService.update({
        slug: $stateParams.slug
      }, $scope.categories, function (res) {
        $state.go('category');
      });
    } else {
      CategoryService.store($scope.category, function (res) {
        $state.go('category');
      });
    }
  };
});
APP.controller('AdminCategoryDeleteController', function ($scope, CategoryService, $stateParams, $state, toastr) {
  $scope.delete = function () {
    CategoryService.delete({
      slug: $stateParams.slug
    }, function (res) {
      $state.go('category');
      toastr.success('Successfully deleted!');
    });
  };
});
APP.controller('AdminDashboardController', function ($scope, $stateParams, toastr, AuthService, $state, ProductService, CategoryService) {// $scope.products = [];
  // $scope.pagination = {};
  // $scope.getProducts = function(page) {
  // 	ProductService.get({page: page}, (res) => {
  // 		$scope.products = res.products.data;
  // 		$scope.pagination = {
  // 			last_page   : new Array(res.products.last_page),
  // 			currentPage : res.products.current_page
  // 		}
  // 	})
  // }
  // $scope.getProducts(1);
});
APP.controller('AdminProductController', function ($scope, $stateParams, AuthService, $state, ProductService) {
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
APP.controller('AdminProductShowController', function ($scope, ProductService, $stateParams) {
  $scope.product = {};
  ProductService.show({
    slug: $stateParams.slug
  }, function (res) {
    $scope.product = res.product;
  });
});
APP.controller('AdminProductEditController', function ($scope, ProductService, $stateParams, CategoryService, $state, Upload) {
  var isAdminEdit = $stateParams.slug != 0;
  $scope.text = !isAdminEdit ? 'Create ' : 'edit ';
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

  if (isAdminEdit) {
    ProductService.show({
      slug: $stateParams.slug
    }, function (res) {
      $scope.product = res.product;
    });
  }

  $scope.save = function () {
    if (isAdminEdit) {
      $scope.uploadFiles($scope.file, $stateParams.slug);
      ProductService.update({
        slug: $stateParams.slug
      }, $scope.product, function (res) {
        $state.go('product');
      });
    } else {
      ProductService.store($scope.product, function (res) {
        $scope.uploadFiles($scope.files, res.slug).then(function () {
          $state.go('product');
        });
      });
    }
  };
});
APP.controller('AdminProductDeleteController', function ($scope, ProductService, $stateParams, $state, toastr) {
  $scope.delete = function () {
    ProductService.delete({
      slug: $stateParams.slug
    }, function (res) {
      $state.go('product');
      toastr.success('Successfully deleted!');
    });
  };
});
APP.controller('AdminUserController', function ($scope, $stateParams, AuthService, $state, UserService) {
  $scope.users = [];

  $scope.getUsers = function (page) {
    UserService.get({
      page: page
    }, function (res) {
      $scope.users = res.users.data;
      $scope.pagination = {
        last_page: new Array(res.users.last_page),
        currentPage: res.users.current_page
      };
    });
  };

  $scope.getUsers(1);
});
APP.controller('AdminUserShowController', function ($scope, UserService, $stateParams) {
  $scope.user = {};
  UserService.show({
    id: $stateParams.id
  }, function (res) {
    $scope.user = res.user;
  });
});
APP.controller('AdminUserEditController', function ($scope, UserService, $stateParams, $state) {
  var isAdminEdit = $stateParams.slug != 0;
  $scope.text = !isAdminEdit ? 'Create ' : 'edit ';
  UserService.get({}, function (res) {
    $scope.users = res.users;
  });

  if (isAdminEdit) {
    UserService.show({
      id: $stateParams.id
    }, function (res) {
      $scope.user = res.user;
    });
  }

  $scope.save = function () {
    if (isAdminEdit) {
      UserService.update({
        id: $stateParams.id
      }, $scope.users, function (res) {
        $state.go('user');
      });
    } else {
      UserService.store($scope.users, function (res) {
        $state.go('user');
      });
    }
  };
});
APP.controller('AdminUserDeleteController', function ($scope, UserService, $stateParams, $state, toastr) {
  $scope.delete = function () {
    UserService.delete({
      id: $stateParams.id
    }, function (res) {
      $state.go('user');
      toastr.success('Successfully deleted!');
    });
  };
});
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
APP.controller('HomeIndexController', function ($scope, UserProductService, $rootScope) {
  $scope.products = [];
  $scope.pagination = {};
  $scope.image = {};
  $rootScope.cartItems = [];

  $scope.getProducts = function (page) {
    UserProductService.get({
      page: page
    }, function (res) {
      $scope.products = res.products.data;
      $scope.image = res.image;
      $scope.pagination = {
        last_page: new Array(res.products.last_page),
        currentPage: res.products.current_page
      };
    });
  };

  $scope.getProducts(1);

  $scope.addCart = function (slug) {
    UserProductService.show({
      slug: slug
    }, function (res) {
      $rootScope.cartItems.push(res.product);
      console.log(res);
    });
    console.log($rootScope.cartItems);
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
  $stateProvider.state('category', {
    url: '/admin/category',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Category/views/index.html',
        controller: 'AdminCategoryController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('category.edit', {
    url: '/:slug/edit',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Category/views/edit.html',
        controller: 'AdminCategoryEditController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('category.delete', {
    url: '/:slug/delete',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Category/views/delete.html',
        controller: 'AdminCategoryDeleteController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
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
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  });
});
APP.config(function ($stateProvider) {
  $stateProvider.state('product', {
    url: '/admin/product',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Product/views/index.html',
        controller: 'AdminProductController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('product.show', {
    url: '/:slug/show',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Product/views/show.html',
        controller: 'AdminProductShowController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('product.edit', {
    url: '/:slug/edit',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Product/views/edit.html',
        controller: 'AdminProductEditController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('product.delete', {
    url: '/:slug/delete',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/Product/views/delete.html',
        controller: 'AdminProductDeleteController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  });
});
APP.config(function ($stateProvider) {
  $stateProvider.state('user', {
    url: '/admin/user',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/User/views/index.html',
        controller: 'AdminUserController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('user.show', {
    url: '/:id/show',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/User/views/show.html',
        controller: 'AdminUserShowController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('user.edit', {
    url: '/:id/edit',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/User/views/edit.html',
        controller: 'AdminUserEditController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
      }
    },
    data: {
      requiresAdminLogin: true,
      isAdmin: true
    }
  }).state('user.delete', {
    url: '/:id/delete',
    views: {
      'content@': {
        templateUrl: 'app/modules/Admin/User/views/delete.html',
        controller: 'AdminUserDeleteController'
      },
      'header@': {
        templateUrl: 'app/modules/Admin/_layouts/views/sidebar.html',
        controller: 'AdminSidebarController'
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

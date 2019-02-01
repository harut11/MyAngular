APP.config(function($stateProvider) {
    $stateProvider
        .state('product',{
            url : '/admin/product',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Product/views/index.html',
                    controller : 'AdminProductController'
                },
                'header@' : {
                    templateUrl : 'app/modules/Admin/_layouts/views/sidebar.html',
                    controller : 'AdminSidebarController'
                }
            },
            data: {
                requiresAdminLogin : true,
                isAdmin : true
            }
        })
        .state('product.edit',{
            url : '/:slug/edit',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Product/views/edit.html',
                    controller : 'AdminProductEditController'
                },
                'header@' : {
                    templateUrl : 'app/modules/Admin/_layouts/views/sidebar.html',
                    controller : 'AdminSidebarController'
                }
            },
            data: {
                requiresAdminLogin : true,
                isAdmin : true
            }
        })
        .state('product.delete',{
            url : '/:slug/delete',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Product/views/delete.html',
                    controller : 'AdminProductDeleteController'
                },
                'header@' : {
                    templateUrl : 'app/modules/Admin/_layouts/views/sidebar.html',
                    controller : 'AdminSidebarController'
                }
            },
            data: {
                requiresAdminLogin : true,
                isAdmin : true
            }
        })
             
});
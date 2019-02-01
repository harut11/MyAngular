APP.config(function($stateProvider) {
    $stateProvider
        .state('category',{
            url : '/admin/category',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Category/views/index.html',
                    controller : 'AdminCategoryController'
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
        .state('category.edit',{
            url : '/:slug/edit',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Category/views/edit.html',
                    controller : 'AdminCategoryEditController'
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
        .state('category.delete',{
            url : '/:slug/delete',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Category/views/delete.html',
                    controller : 'AdminCategoryDeleteController'
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
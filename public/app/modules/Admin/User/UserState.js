APP.config(function($stateProvider) {
    $stateProvider
        .state('user',{
            url : '/admin/user',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/User/views/index.html',
                    controller : 'AdminUserController'
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
        .state('user.delete',{
            url : '/:id/delete',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/User/views/delete.html',
                    controller : 'AdminUserDeleteController'
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
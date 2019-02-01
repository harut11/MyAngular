APP.config(function($stateProvider) {
    $stateProvider
        .state('dashboard',{
            url : '/admin/dashboard',
            views : {
                'content@' : {
                    templateUrl : 'app/modules/Admin/Dashboard/views/index.html',
                    controller : 'AdminDashboardController'
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
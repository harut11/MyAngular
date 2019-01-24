APP.config(function ($stateProvider) {
    $stateProvider
        .state('about', {
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
        })
})
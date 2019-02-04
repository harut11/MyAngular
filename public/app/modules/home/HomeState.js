APP.config(function ($stateProvider) {
    $stateProvider
        .state('/', {
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
        })
        .state('show', {
            url: "show/:slug",
            views: {
                'header@': {
                    templateUrl: "/app/modules/_layout/views/_header.html",
                    controller: "HeaderController"
                },
                'content@': {
                    templateUrl: "/app/modules/Home/views/show.html",
                    controller: "HomeShowController"
                },
                'footer@': {
                    templateUrl: "/app/modules/_layout/views/_footer.html",
                    controller: "HomeIndexController"
                }
            }
        })
})
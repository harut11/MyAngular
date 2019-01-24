APP.config(function ($stateProvider) {
	$stateProvider
		.state('products', {
			url: "/products",
			views: {
				'header@' : {
					templateUrl: "/app/modules/_layout/views/_header.html",
					controller: "HeaderController"
				},
				'content@' : {
					templateUrl: "/app/modules/Product/views/index.html",
					controller: "ProductIndexController"
				}
			}
		})

		.state('products.show', {
			url: "/:slug/show",
			views: {
				'header@' : {
					templateUrl: "/app/modules/_layout/views/_header.html",
					controller: "HeaderController"
				},
				'content@' : {
					templateUrl: "/app/modules/Product/views/show.html",
					controller: "ProductShowController"
				}
			}
		})

		.state('products.edit', {
			url: "/:slug/edit",
			views: {
				'header@' : {
					templateUrl: "/app/modules/_layout/views/_header.html",
					controller: "HeaderController"
				},
				'content@' : {
					templateUrl: "/app/modules/Product/views/edit.html",
					controller: "ProductEditController"
				}
			}
		})

		.state('products.delete', {
			url: "/:slug/delete",
			views: {
				'header@' : {
					templateUrl: "/app/modules/_layout/views/_header.html",
					controller: "HeaderController"
				},
				'content@' : {
					templateUrl: "/app/modules/Product/views/delete.html",
					controller: "ProductDeleteController"
				}
			}
		})
})
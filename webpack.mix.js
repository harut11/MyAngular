const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
	.combine([
		'./node_modules/angular/angular.js',
		'./node_modules/@uirouter/angularjs/release/angular-ui-router.js',
		'./node_modules/angular-resource/angular-resource.js',
		'./node_modules/angular-animate/angular-animate.js',
		'./node_modules/angular-toastr/dist/angular-toastr.tpls.js',
		'./node_modules/ng-file-upload/dist/ng-file-upload.js',
		'./node_modules/angular-jwt/dist/angular-jwt.js',
	], 'public/js/angular.js')
	.babel([
		'public/app/main.js',
		'public/app/services/*Service.js',
		'public/app/modules/**/*Module.js',
		'public/app/modules/**/*State.js',
	], 'public/js/main.js')
    .sass('resources/sass/app.scss', 'public/css')
    .version();

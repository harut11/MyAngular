<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::post('register', 'AuthController@register');
    Route::post('verify', 'AuthController@verify');
    Route::post('reset', 'AuthController@reset');
    Route::post('set-password', 'AuthController@setPassword');
});

Route::group([
    'middleware' => 'auth:api'
], function () {
    Route::resource('products', 'ProductController');
    Route::post('products/images', 'ProductController@uploadImages');
    Route::resource('categories', 'CategoryController');
});